'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, getApiErrorMessage } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Star, ShieldCheck, ClipboardCheck, ArrowRight, 
  MessageSquare, Loader2, Minus, Plus, Trash2, Edit3, Image as ImageIcon,
  Heart, Share2, MapPin, CheckCircle, FileText, Download, Info,
  ExternalLink, MessageCircle, ThumbsUp, Send, User, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// ── Fallback demo catalog (mirrors products/page.tsx ROBUST_FALLBACK_PRODUCTS) ──
const DEMO_PRODUCTS = [
  { slug: '5-axis-automated-milling-cnc-machine', name: '5-Axis Automated Milling CNC Machine', price: 1250000, min_order_quantity: 1, sku: 'DEMO-MACH-001', description: 'Precision 5-axis automated milling center for high-throughput aerospace-grade titanium and aluminum carving. Features dual-servo spindle, auto-tool-changer (ATC) with 24-station carousel, and built-in coolant system.', category: { id: 0, name: 'Industrial Machinery' }, image: 'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=800' },
  { slug: '500-ton-cold-forming-hydraulic-press', name: '500-Ton Cold Forming Hydraulic Press', price: 840000, min_order_quantity: 1, sku: 'DEMO-MACH-002', description: 'Industrial grade cold-forming hydraulic press with structural reinforced frame and programmable logic control. 500-ton capacity with precision tonnage monitoring and hydraulic overload protection.', category: { id: 0, name: 'Industrial Machinery' }, image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=800' },
  { slug: 'rotary-screw-high-pressure-compressor', name: 'Rotary Screw High-Pressure Compressor', price: 185000, min_order_quantity: 2, sku: 'DEMO-MACH-003', description: 'Dynamic direct-drive rotary screw air compression system with integrated refrigerated air dryer and receiver tank. Delivers 850 CFM at 175 PSI continuous operation.', category: { id: 0, name: 'Industrial Machinery' }, image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800' },
  { slug: 'modular-high-performance-automation-plc', name: 'Modular High-Performance Automation PLC', price: 45000, min_order_quantity: 5, sku: 'DEMO-ELEC-001', description: 'Enterprise rack-mount programmable logic controller supporting dual Ethernet/IP and Profinet node topology. 64 I/O channels, 512MB RAM, real-time processing at 0.08ms scan cycle.', category: { id: 0, name: 'Electronics' }, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
  { slug: 'vacuum-molded-low-voltage-circuit-breaker', name: 'Vacuum Molded Low-Voltage Circuit Breaker', price: 12500, min_order_quantity: 20, sku: 'DEMO-ELEC-002', description: 'High rupture capacity, molded case main circuit breaker with precise overcurrent and short-circuit trip relays. Rated 800A at 690VAC with IEC 60947-2 compliance.', category: { id: 0, name: 'Electronics' }, image: 'https://images.unsplash.com/photo-1558346490-a72e93cf2c04?auto=format&fit=crop&q=80&w=800' },
  { slug: 'ip69k-proximity-range-sensor-array', name: 'IP69K Proximity Range Sensor Array', price: 3400, min_order_quantity: 50, sku: 'DEMO-ELEC-003', description: 'Extremely robust ultrasonic distance detection sensor for automation lines under harsh temperatures. IP69K rated, -40°C to +85°C operating range, 0.1mm resolution.', category: { id: 0, name: 'Electronics' }, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' },
  { slug: 'heavy-logistic-truck-differential-gear', name: 'Heavy Logistic Truck Differential Gear', price: 75000, min_order_quantity: 5, sku: 'DEMO-AUTO-001', description: 'Hardened alloy steel drive shafts and matched gearsets built for high-torque commercial truck applications. SAE 8620 case-hardened steel, 500,000km service life rated.', category: { id: 0, name: 'Automotive Parts' }, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800' },
  { slug: 'high-load-spherical-roller-bearing', name: 'High-Load Spherical Roller Bearing', price: 2500, min_order_quantity: 100, sku: 'DEMO-AUTO-002', description: 'Premium heavy-duty heat-treated steel spherical bearings designed for massive radial load and rotation. FAG / SKF equivalent specification, 120mm bore, C3 internal clearance.', category: { id: 0, name: 'Automotive Parts' }, image: 'https://images.unsplash.com/photo-1530047625168-4b29bf81140a?auto=format&fit=crop&q=80&w=800' },
  { slug: 'hot-rolled-carbon-steel-coil-sae-1008', name: 'Hot-Rolled Carbon Steel Coil (SAE 1008)', price: 65000, min_order_quantity: 5, sku: 'DEMO-STEEL-001', description: 'Prime quality flat hot-rolled structural steel coil for sheet metal pressing and automotive brackets. 2.5mm thickness, 1500mm width, SAE 1008 grade, tensile strength 310 MPa.', category: { id: 0, name: 'Steel & Construction' }, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800' },
  { slug: '2u-dual-processor-enterprise-xeon-server', name: '2U Dual Processor Enterprise Xeon Server', price: 450000, min_order_quantity: 1, sku: 'DEMO-IT-001', description: 'Hyperdense cloud-scale server with 256GB RAM, redundant hot-swap titanium PSUs, and SAS RAID controllers. Dual Intel Xeon Gold 6342, 24-core each, 4× NVMe U.2 slots.', category: { id: 0, name: 'Computers & IT' }, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800' },
  { slug: '7u-dual-processor-enterprise-xeon-server', name: '7U Dual Processor Enterprise Xeon Server', price: 620000, min_order_quantity: 1, sku: 'DEMO-IT-002', description: 'Enterprise-grade high-density 7U rack server with dual Intel Xeon Platinum processors, 512GB ECC RAM, and 12× hot-swap NVMe drive bays. Designed for mission-critical workloads.', category: { id: 0, name: 'Computers & IT' }, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800' },
];

interface Review {
  id: number;
  rating: number;
  comment: string;
  image_path?: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  min_order_quantity: number;
  sku: string;
  model_number?: string;
  unit?: string;
  price_min?: number | string;
  price_max?: number | string;
  category?: { id: number; name: string; slug?: string };
  seller_id?: number;
  seller?: {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    seller_profile?: {
      company_name: string;
      about_company?: string;
      gst_number?: string;
      business_address?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      logo?: string;
      website?: string;
      is_verified?: boolean;
      membership_type?: string;
    };
    sellerProfile?: {
      company_name: string;
      about_company?: string;
      gst_number?: string;
      business_address?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      logo?: string;
      website?: string;
      is_verified?: boolean;
      membership_type?: string;
    };
  };
  images?: Array<{ id: number; image_path: string; is_primary: boolean }>;
  primary_image?: { image_path: string };
  primaryImage?: { image_path: string };
  reviews: Review[];
}

interface RelatedProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  moq: number;
  image: string;
  category: string;
}

interface APIProduct {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  primary_image?: { image_path?: string } | null;
  primaryImage?: { image_path?: string } | null;
  price_min?: number | string;
  price?: number | string;
  min_order_quantity?: number | string;
  moq?: number | string;
  category?: { name?: string } | null;
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  
  // Custom Visual Gallery state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Zoom on hover state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'downloads' | 'seller'>('overview');

  // RFQ Modal State
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqQty, setRfqQty] = useState(10);
  const [rfqTargetPrice, setRfqTargetPrice] = useState('');
  const [rfqDescription, setRfqDescription] = useState('');
  const [submittingRfq, setSubmittingRfq] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  // Contact Seller Modal State
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryQty, setInquiryQty] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Wishlist & Share logic
  const [isSaved, setIsSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Review System State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImageUrl, setReviewImageUrl] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  // Review votes / helpful counters (local tracking)
  const [reviewVotes, setReviewVotes] = useState<Record<number, number>>({});
  const [votedReviews, setVotedReviews] = useState<Record<number, boolean>>({});

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Helper: build gallery from a primary image URL (for demo products)
  const buildGalleryFromSingleImage = (primaryImg: string): string[] => {
    const supplementary = [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    ];
    return [primaryImg, ...supplementary.filter(u => u !== primaryImg)].slice(0, 4);
  };

  // Fetch product specifications and relations
  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/products/${slug}`);
      const data = response.data.data;

      if (!data) throw new Error('No data returned');

      setProduct(data);
      setReviews(data.reviews || []);
      
      // Calculate Purchase Quantities
      const initialMoq = Number(data.min_order_quantity || 1);
      setQuantity(initialMoq);
      setRfqQty(initialMoq * 5);
      setInquiryQty(String(initialMoq));

      // Build product visual gallery
      let imgs: string[] = [];
      if (data.images && data.images.length > 0) {
      imgs = data.images.map((img: { image_path?: string }) => img.image_path || '');
      } else {
        const prim = data.primary_image?.image_path || data.primaryImage?.image_path;
        if (prim) imgs.push(prim);
      }

      // Safeguard: dynamic fallback B2B photography to give editorial aesthetic
      if (imgs.length === 0) {
        imgs = [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (imgs.length < 4) {
        const fallbacks = [
          'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
        ];
        fallbacks.forEach(fb => {
          if (imgs.length < 4 && !imgs.includes(fb)) imgs.push(fb);
        });
      }
      
      setGalleryImages(imgs);
      setActiveImage(imgs[0]);

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`tatamart_wishlist_${data.id}`);
        if (saved === 'true') setIsSaved(true);
      }

      if (data.category?.id) {
        fetchRelatedProducts(data.category.id, data.id);
      } else {
        setLoadingRelated(false);
      }

    } catch (error) {
      // ── Fallback: try to match against local demo catalog ──
      const currentSlug = typeof slug === 'string' ? slug : Array.isArray(slug) ? slug[0] : '';
      const demoMatch = DEMO_PRODUCTS.find(p => p.slug === currentSlug);

      if (demoMatch) {
        // Synthesize a Product object that satisfies the interface
        const synthetic: Product = {
          id: 0,
          name: demoMatch.name,
          slug: demoMatch.slug,
          description: demoMatch.description,
          price: demoMatch.price,
          min_order_quantity: demoMatch.min_order_quantity,
          sku: demoMatch.sku,
          model_number: 'DEMO-MODEL',
          unit: 'Unit',
          price_min: demoMatch.price,
          price_max: Math.round(demoMatch.price * 1.15),
          category: demoMatch.category,
          seller: {
            id: 0,
            name: 'TATAmart Sourcing Hub',
            email: 'sourcing@tatamart.in',
            seller_profile: {
              company_name: 'TATAmart Certified Sourcing Hub',
              about_company: 'Tier-1 certified manufacturer and contract provider catering high-stakes industrial parts and mechanical components across TATAmart distribution points.',
              city: 'Jamshedpur',
              state: 'Jharkhand',
              is_verified: true,
              membership_type: 'GOLD',
            }
          },
          images: undefined,
          primary_image: { image_path: demoMatch.image },
          reviews: [],
        };
        setProduct(synthetic);
        setReviews([]);
        const moq = demoMatch.min_order_quantity;
        setQuantity(moq);
        setRfqQty(moq * 5);
        setInquiryQty(String(moq));
        const imgs = buildGalleryFromSingleImage(demoMatch.image);
        setGalleryImages(imgs);
        setActiveImage(imgs[0]);
        setLoadingRelated(false);
      } else {
        console.error('Error loading B2B product specifications:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: number, currentProductId: number) => {
    try {
      const response = await api.get('/products', { params: { category_id: categoryId } });
      const records: APIProduct[] = response.data.data?.data || [];
      const filtered = records
        .filter((p) => Number(p.id) !== Number(currentProductId))
        .slice(0, 4)
        .map((p) => {
          const prim = p.primary_image || p.primaryImage;
          return {
            id: String(p.id),
            title: p.name || p.title || 'Vetted Asset',
            slug: p.slug || '',
            price: Number(p.price_min || p.price || 0),
            moq: Number(p.min_order_quantity || p.moq || 1),
            image: prim?.image_path || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
            category: p.category?.name || 'Industrial'
          };
        });
      setRelatedProducts(filtered);
    } catch (err) {
      console.error('Failed to load related products:', err);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Image Hover Zoom Coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Standard Wholesale price helper
  const unitPrice = product ? (product.price || Number(product.price_min) || 0) : 0;

  // Bulk Discount Calculator Tiers
  const discountTiers = [
    { range: `1 - 9 units`, discount: 'Base Rate', rateMultiplier: 1.0 },
    { range: `10 - 49 units`, discount: '5% Volume Off', rateMultiplier: 0.95 },
    { range: `50 - 199 units`, discount: '10% Corporate Off', rateMultiplier: 0.90 },
    { range: `200+ units`, discount: '15% Supplier Direct', rateMultiplier: 0.85 },
  ];

  const getCalculatedPrice = (qty: number) => {
    if (qty >= 200) return unitPrice * 0.85;
    if (qty >= 50) return unitPrice * 0.90;
    if (qty >= 10) return unitPrice * 0.95;
    return unitPrice;
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (product && quantity > Number(product.min_order_quantity || 1)) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!product) return;
    // Demo products cannot be carted
    if (product.id === 0) {
      alert('This is a catalog demonstration product. Register as a buyer to purchase real products.');
      return;
    }

    setAddingToCart(true);
    try {
      await api.post('/cart/items', {
        product_id: product.id,
        quantity: quantity
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (error) {
      console.error('Add to cart operation failed:', error);
      alert(getApiErrorMessage(error, 'Addition failed. Validate account authentication.'));
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy Now Flow (Add to cart + push directly to checkout)
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!product) return;
    // Demo products cannot be purchased
    if (product.id === 0) {
      alert('This is a catalog demonstration product. Register as a buyer to purchase real products.');
      return;
    }

    setBuyingNow(true);
    try {
      await api.post('/cart/items', {
        product_id: product.id,
        quantity: quantity
      });
      router.push('/checkout');
    } catch (error) {
      console.error('Buy Now transaction initialization failed:', error);
      alert(getApiErrorMessage(error, 'Purchase flow blocked. Try again.'));
      setBuyingNow(false);
    }
  };

  // RFQ Submission
  const handleOpenRfq = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setRfqDescription(`Enterprise inquiry regarding high volume supply of: ${product?.name}. We require technical sheets, standard transport parameters, customs clearance compliance and custom billing terms.`);
    setShowRfqModal(true);
  };

  const handleSubmitRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const minQty = Number(product.min_order_quantity || 1);
    if (rfqQty < minQty) {
      alert(`The target seller requires a minimum procurement order of ${minQty} units.`);
      return;
    }

    setSubmittingRfq(true);
    try {
      await api.post('/rfqs', {
        title: `Sourcing Inquiry: ${product.name}`,
        description: rfqDescription,
        quantity: rfqQty,
        targetPrice: rfqTargetPrice ? parseFloat(rfqTargetPrice) : null,
        categoryId: product.category?.id
      });
      setRfqSuccess(true);
      setTimeout(() => {
        setRfqSuccess(false);
        setShowRfqModal(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit sourcing quote:', error);
      alert(getApiErrorMessage(error, 'Failed to log RFQ. Please check credentials.'));
    } finally {
      setSubmittingRfq(false);
    }
  };

  // Contact Seller / Send Direct Inquiry Flow
  const handleOpenInquiry = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setInquiryMessage(`Hello, we are interested in procurement terms for ${product?.name}. Could you provide details on custom logistics pipelines and packaging weights?`);
    setShowInquiryModal(true);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmittingInquiry(true);
    try {
      await api.post('/products/inquire', {
        product_id: product.id,
        message: inquiryMessage,
        quantity: inquiryQty
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setShowInquiryModal(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to register inquiry:', error);
      alert(getApiErrorMessage(error, 'Direct contact failed. Validate network connections.'));
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Wishlist toggle
  const toggleSaveProduct = () => {
    if (!product) return;
    const nextState = !isSaved;
    setIsSaved(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`tatamart_wishlist_${product.id}`, String(nextState));
    }
  };

  // Share Product Link
  const handleShareProduct = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // Reviews submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    setReviewError('');

    try {
      if (editingReviewId) {
        const response = await api.put(`/products/reviews/${editingReviewId}`, {
          rating,
          comment,
          image_url: reviewImageUrl
        });
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReviewId ? response.data.data : r))
        );
        setEditingReviewId(null);
      } else {
        const response = await api.post('/products/reviews', {
          product_id: product.id,
          rating,
          comment,
          image_url: reviewImageUrl
        });
        setReviews((prev) => [response.data.data, ...prev]);
      }
      setComment('');
      setReviewImageUrl('');
      setRating(5);
    } catch (err) {
      setReviewError(getApiErrorMessage(err, 'Could not post feedback. Reviews are limited to verified buyers of this asset.'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (rev: Review) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setComment(rev.comment);
    setReviewImageUrl(rev.image_path || '');
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to remove this verified product feedback?')) return;
    try {
      await api.delete(`/products/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to remove review:', error);
    }
  };

  // Local Upvotes tracking for helpful feedback reviews
  const handleVoteHelpful = (id: number) => {
    if (votedReviews[id]) return;
    setReviewVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setVotedReviews((prev) => ({ ...prev, [id]: true }));
  };

  // Technical Specifications Table Generator based on Category
  const getSpecifications = () => {
    if (!product) return [];
    const cat = (product.category?.name || '').toLowerCase();
    
    if (cat.includes('electr') || cat.includes('plc') || cat.includes('automation')) {
      return [
        { key: 'Model Reference', value: product.model_number || 'TM-EL-992' },
        { key: 'Material Composition', value: 'Flame-Retardant FR4, Electrolytic Copper' },
        { key: 'Operating Voltage', value: '24V DC / 110V-220V AC Adaptive' },
        { key: 'Item Net Weight', value: '450 grams' },
        { key: 'Production Capacity', value: '25,000 Units / Month' },
        { key: 'Packaging Format', value: 'Antistatic Foam Tray, Vacuum Sealed' },
        { key: 'Compliance Standards', value: 'IEC 61131-2, CE, RoHS, UL Listed' },
        { key: 'Warranty Period', value: '18 Months Manufacturer Warranty' },
        { key: 'Country of Origin', value: 'India' },
        { key: 'Enclosure Rating', value: 'IP20 / IP67 Options Available' },
      ];
    } else if (cat.includes('comput') || cat.includes('hardware') || cat.includes('it')) {
      return [
        { key: 'Model Reference', value: product.model_number || 'TM-SRV-X5' },
        { key: 'Chassis Type', value: '2U Rackmount (Standard 19-inch width)' },
        { key: 'Material Type', value: 'Heavy Duty SGCC Zinc-Coated Steel' },
        { key: 'Power Efficiency', value: '80 Plus Platinum Redundant Dual PSU (800W)' },
        { key: 'Total Weight', value: '12.8 kg' },
        { key: 'Packaging Format', value: 'High-Density EPE Foam Protective Carton' },
        { key: 'Compliance Standards', value: 'FCC Class A, CE, VCCI, BIS Certified' },
        { key: 'Warranty Period', value: '3 Years Next Business Day Onsite' },
        { key: 'Country of Origin', value: 'India' },
      ];
    } else if (cat.includes('mechan') || cat.includes('machin') || cat.includes('steel') || cat.includes('construction') || cat.includes('part')) {
      return [
        { key: 'Model Reference', value: product.model_number || 'TM-MC-200' },
        { key: 'Material Composition', value: 'High-Tensile Structural Carbon Steel (SAE 1008)' },
        { key: 'Tensile Strength', value: '340 MPa Min' },
        { key: 'Item Net Weight', value: 'Varies by Order Volume' },
        { key: 'Production Capacity', value: '1,500 Tons / Month' },
        { key: 'Packaging Format', value: 'Anti-Rust VCI Wrap on Heavy Duty Skids' },
        { key: 'Compliance Standards', value: 'ASTM A36, ISO 9001:2015, BIS' },
        { key: 'Warranty Period', value: '12 Months Structural Warranty' },
        { key: 'Country of Origin', value: 'India' },
      ];
    } else {
      return [
        { key: 'Model Reference', value: product.model_number || 'TM-GEN-01' },
        { key: 'Material Composition', value: 'Industrial Grade Polymer & Alloy Composite' },
        { key: 'Item Net Weight', value: '1.2 kg standard' },
        { key: 'Packaging Format', value: 'Double-Walled Corrugated Box with Polybags' },
        { key: 'Compliance Standards', value: 'ISO 9001, RoHS Compliant' },
        { key: 'Warranty Period', value: '12 Months Standard Warranty' },
        { key: 'Country of Origin', value: 'India' },
      ];
    }
  };

  // Simulating downloadable documents on client-side
  const handleDownloadDoc = (docType: string) => {
    if (!product) return;
    const content = `TATAmart Enterprise Procurement Document
--------------------------------------------------
Document Type: ${docType}
Product Name: ${product.name}
SKU Reference: ${product.sku || 'TM-N/A'}
Model Number: ${product.model_number || 'TM-MOD'}
Generated On: ${new Date().toLocaleDateString()}
Vetting Status: TATAmart Vetted & Verified Tier-1 Asset

This is a dynamically compiled technical document for ${product.name}.
To receive custom CAD files (.step/.dwg) or formal signed compliance certificates, contact our Sourcing Concierge or Seller Account Manager directly.

TATAmart Industrial Marketplace
Navi Mumbai, India`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.name.replace(/\s+/g, '_')}_${docType.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-zinc-950 pt-32 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-ink-black dark:text-white animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background dark:bg-zinc-950 pt-32 text-center">
        <div className="max-w-md mx-auto py-20 px-6">
          <h2 className="font-heading text-3xl font-medium text-ink-black dark:text-white mb-3">Product Not Found</h2>
          <p className="text-sm text-zinc-500 mb-8 font-sans">The requested product does not exist or is currently unavailable.</p>
          <Link href="/products" className="bg-ink-black hover:bg-forest-accent dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-sans text-xs uppercase tracking-wider px-8 py-3.5 rounded-none transition-all">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  // Calculate Average reviews rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  // Calculate rating stars distribution
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : stars === 5 ? 100 : 0;
    return { stars, count, percentage };
  });

  // Extract seller profiles safely (camelCase / snake_case properties fallback)
  const sellerObj = product.seller;
  const sellerProfile = sellerObj?.seller_profile || sellerObj?.sellerProfile;
  const sellerCompanyName = sellerProfile?.company_name || 'Tata Certified Sourcing Hub';
  const sellerLocation = `${sellerProfile?.city || 'Jamshedpur'}, ${sellerProfile?.state || 'Jharkhand'}, India`;
  const sellerIsVerified = sellerProfile?.is_verified ?? true;
  const sellerAbout = sellerProfile?.about_company || `Tier-1 certified manufacturer and contract provider catering high-stakes industrial parts and mechanical components across TATAmart distribution points.`;

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950 text-ink-black dark:text-zinc-100 pt-24 selection:bg-ink-black selection:text-white transition-colors duration-300">

      <main className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        {/* Breadcrumb telemetry */}
        <div className="mb-12 font-monoenterprise text-[10px] tracking-widest uppercase text-zinc-400 dark:text-zinc-550 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-ink-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-ink-black dark:hover:text-white transition-colors">Marketplace</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-500 dark:text-zinc-650">{product.category?.name || 'Inventory'}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-black dark:text-white truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Demo product notice */}
        {product.id === 0 && (
          <div className="mb-8 flex items-start gap-3 border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-5 py-4">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-monoenterprise text-[10px] uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400 mb-0.5">
                Catalog Demo Product
              </p>
              <p className="font-sans text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                This is a demonstration product from the TATAmart curated catalog. Live pricing and procurement features require an account. <Link href="/auth/register" className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-200">Register as a buyer</Link> to place real orders.
              </p>
            </div>
          </div>
        )}

        {/* B2B Alerts Banners */}
        <AnimatePresence>
          {shareToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-28 right-8 z-50 bg-[#F0EBE5] dark:bg-zinc-900 border border-ink-black dark:border-white px-6 py-4 rounded-none text-xs font-monoenterprise uppercase tracking-widest flex items-center gap-2.5 shadow-sm text-ink-black dark:text-white"
            >
              <ClipboardCheck className="h-4 w-4 text-[#346941]" />
              <span>Link copied to Procurement clipboard</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Left Column: Multi-Image Showcase with Zoom */}
          <div className="lg:col-span-7 space-y-4">
            <div 
              ref={mainImageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              className="relative aspect-[4/3] w-full border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center cursor-zoom-in group rounded-[4px]"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain grayscale-[0.2] transition-transform duration-200"
                style={isZoomed ? {
                  transform: 'scale(2.2)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                } : undefined}
              />
              
              <span className="absolute top-4 left-4 bg-ink-black text-white text-[8px] font-monoenterprise uppercase tracking-widest px-3 py-1.5 rounded-none">
                SKU: {product.sku || `TM-${String(product.id).padStart(5, '0')}`}
              </span>
              
              {sellerIsVerified && (
                <div className="absolute top-4 right-4 bg-[#346941]/10 text-[#346941] border border-[#346941]/20 text-[8px] font-monoenterprise uppercase tracking-widest px-2.5 py-1 rounded-[2px] backdrop-blur-sm flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 fill-current" />
                  <span>VETTED PARTNER</span>
                </div>
              )}
            </div>

            {/* Thumbnail Canvas */}
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-video w-full border transition-all overflow-hidden rounded-[2px] bg-white dark:bg-zinc-900 flex items-center justify-center p-1 cursor-pointer ${
                    activeImage === img 
                      ? 'border-ink-black dark:border-white ring-1 ring-ink-black dark:ring-white' 
                      : 'border-border-subtle dark:border-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  <img src={img} alt={`Angle ${index + 1}`} className="object-cover w-full h-full grayscale-[0.3] hover:grayscale-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing, MOQ and actions */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-3">
              <span className="font-monoenterprise text-[10px] uppercase tracking-widest text-[#346941] dark:text-green-400 font-bold block">
                {product.category?.name || 'Verified Sourcing'}
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-ink-black dark:text-white leading-tight">
                {product.name}
              </h1>
              <p className="font-sans text-xs text-zinc-500 flex items-center gap-2">
                <span>Model: <span className="font-monoenterprise">{product.model_number || 'TM-MOD'}</span></span>
                <span>•</span>
                <span>Seller: <span className="underline hover:text-ink-black cursor-pointer">{sellerCompanyName}</span></span>
              </p>
            </div>

            {/* Rating overview */}
            <div className="flex items-center space-x-3 py-4 border-y border-border-subtle dark:border-zinc-800">
              <div className="flex items-center text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-[2px]">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 text-xs font-bold text-ink-black dark:text-white">{averageRating}</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <span className="text-xs font-monoenterprise uppercase tracking-wider text-zinc-500">
                {totalReviews} Buyer {totalReviews === 1 ? 'Review' : 'Reviews'}
              </span>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <span className="text-[10px] font-monoenterprise text-emerald-600 dark:text-green-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 font-bold uppercase tracking-wider rounded-[2px]">
                In Stock
              </span>
            </div>

            {/* Price display */}
            <div className="space-y-1">
              <p className="font-monoenterprise text-[10px] text-zinc-400 uppercase tracking-widest">Estimated Unit Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-heading text-ink-black dark:text-white font-medium" suppressHydrationWarning>
                  ₹{getCalculatedPrice(quantity).toLocaleString()}
                </span>
                <span className="text-xs font-sans text-zinc-500">/ {product.unit || 'unit'}</span>
              </div>
              <p className="text-[10px] font-sans text-zinc-400">Exclusive of 18% GST (ITC claimable)</p>
            </div>

            {/* Bulk discount metrics matrix */}
            <div className="bg-[#F0EBE5]/30 dark:bg-zinc-900/30 border border-border-subtle dark:border-zinc-800 p-4 rounded-[4px] space-y-3">
              <h4 className="font-monoenterprise text-[9px] uppercase tracking-widest text-ink-black dark:text-white font-bold flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-[#346941]" />
                <span>Wholesale Quantity Discount Tiers</span>
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-sans">
                {discountTiers.map((tier, idx) => (
                  <div key={idx} className="p-2 border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-950/50 rounded-[2px] flex flex-col justify-between">
                    <span className="font-monoenterprise text-[8px] text-zinc-400 block mb-1">{tier.range}</span>
                    <span className="font-bold text-ink-black dark:text-zinc-200" suppressHydrationWarning>
                      ₹{Math.round(unitPrice * tier.rateMultiplier).toLocaleString()}
                    </span>
                    <span className="text-[8px] text-[#346941] font-bold block mt-1">{tier.discount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Vetting specs list */}
            <div className="space-y-2 text-xs font-sans text-zinc-650 dark:text-zinc-400">
              <div className="flex justify-between py-1 border-b border-border-subtle/50 dark:border-zinc-800/50">
                <span className="font-monoenterprise text-[10px] uppercase text-zinc-400">Min. Order (MOQ)</span>
                <span className="font-bold text-ink-black dark:text-white">{product.min_order_quantity || 1} {product.unit || 'units'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/50 dark:border-zinc-800/50">
                <span className="font-monoenterprise text-[10px] uppercase text-zinc-400">Dispatch Location</span>
                <span className="text-ink-black dark:text-white">{sellerLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/50 dark:border-zinc-800/50">
                <span className="font-monoenterprise text-[10px] uppercase text-zinc-400">Estimated Logistics</span>
                <span className="text-ink-black dark:text-white">Ships in 3-5 working days</span>
              </div>
            </div>

            {/* Quantity Controller */}
            <div className="space-y-2">
              <label className="block font-monoenterprise text-[10px] uppercase tracking-widest text-zinc-400">Procurement Quantity</label>
              <div className="flex items-center justify-between border border-border-subtle dark:border-zinc-800 rounded-[4px] bg-white dark:bg-zinc-900 p-1 shadow-none">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= Number(product.min_order_quantity || 1)}
                  className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-ink-black dark:hover:text-white transition-all disabled:opacity-30 rounded-none cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 text-sm font-monoenterprise font-bold text-ink-black dark:text-white">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-ink-black dark:hover:text-white transition-all rounded-none cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sourcing Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex items-center justify-center gap-2.5 rounded-[4px] bg-[#F0EBE5] hover:bg-[#e8e2d9] text-ink-black dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-white border border-border-subtle dark:border-zinc-800 font-monoenterprise text-[10px] uppercase tracking-widest py-4 transition-all disabled:opacity-50 cursor-pointer font-bold"
              >
                {addingToCart ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : cartSuccess ? (
                  <>
                    <ClipboardCheck className="h-4 w-4 text-[#346941]" />
                    <span>Allocated to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="flex items-center justify-center gap-2.5 rounded-[4px] bg-ink-black hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-monoenterprise text-[10px] uppercase tracking-widest py-4 transition-all disabled:opacity-50 cursor-pointer font-bold"
              >
                {buyingNow ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Buy Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* RFQ Sourcing Action */}
            <button
              onClick={handleOpenRfq}
              className="w-full flex items-center justify-center gap-2 rounded-[4px] border border-ink-black text-ink-black dark:border-white dark:text-white hover:bg-ink-black hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 font-monoenterprise text-[10px] uppercase tracking-widest py-4 transition-all cursor-pointer font-bold"
            >
              <span>Submit Sourcing RFQ</span>
              <ExternalLink className="h-4 w-4" />
            </button>

            {/* Sharing and Wishlist buttons */}
            <div className="flex gap-4 items-center justify-between border-t border-border-subtle dark:border-zinc-800 pt-4">
              <button 
                onClick={toggleSaveProduct}
                className="flex items-center gap-2 text-xs font-monoenterprise uppercase text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isSaved ? 'Saved in Wishlist' : 'Save Product'}</span>
              </button>
              <button 
                onClick={handleShareProduct}
                className="flex items-center gap-2 text-xs font-monoenterprise uppercase text-zinc-400 hover:text-ink-black dark:hover:text-white transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* TABS COMPONENT FOR SPEC SHEET, DESCRIPTION, DOWNLOADS, AND SELLER */}
        <section className="mb-24">
          <div className="flex border-b border-border-subtle dark:border-zinc-800 overflow-x-auto no-scrollbar mb-8">
            {(['overview', 'specifications', 'downloads', 'seller'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-monoenterprise text-[10px] uppercase tracking-widest font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-ink-black dark:border-white text-ink-black dark:text-white' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-650'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[250px]">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-12 font-sans"
              >
                <div className="md:col-span-8 space-y-6">
                  <div>
                    <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white mb-3">Product Description</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                      {product.description || 'No detailed specifications published yet.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-medium text-ink-black dark:text-white mb-3">Industrial & Business Applications</h4>
                    <p className="text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
                      Customarily deployed in enterprise-scale industrial assemblies, manufacturing pipelines, smart control stations, and hardware structures. Designed specifically to endure long duty cycles with extreme structural integrity.
                    </p>
                  </div>
                </div>
                <div className="md:col-span-4 bg-[#F0EBE5]/20 dark:bg-zinc-900/20 p-6 border border-border-subtle dark:border-zinc-800 rounded-[4px] space-y-4">
                  <h4 className="font-heading text-lg font-medium text-ink-black dark:text-white">Procurement Parameters</h4>
                  <div className="space-y-2 text-xs">
                    <p className="flex justify-between"><span className="text-zinc-450">Standards:</span> <span className="font-bold">CE, RoHS Compliant</span></p>
                    <p className="flex justify-between"><span className="text-zinc-450">Vetting Score:</span> <span className="font-bold">Tier-1 Verified Vendor</span></p>
                    <p className="flex justify-between"><span className="text-zinc-450">Warranty:</span> <span className="font-bold">1 Year Standard</span></p>
                    <p className="flex justify-between"><span className="text-zinc-450">Packaging:</span> <span className="font-bold">Bulk Wooden Crating / Trays</span></p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white mb-6">Technical Specifications Sheet</h3>
                <div className="border border-border-subtle dark:border-zinc-800 rounded-[4px] overflow-hidden font-sans">
                  <table className="w-full text-sm text-left border-collapse">
                    <tbody>
                      {getSpecifications().map((spec, idx) => (
                        <tr 
                          key={idx} 
                          className={`border-b border-border-subtle dark:border-zinc-800 ${
                            idx % 2 === 0 ? 'bg-zinc-50/50 dark:bg-zinc-950/20' : 'bg-white dark:bg-zinc-900/10'
                          }`}
                        >
                          <td className="py-4 px-6 font-monoenterprise text-[10px] uppercase text-zinc-450 w-1/3">{spec.key}</td>
                          <td className="py-4 px-6 text-ink-black dark:text-zinc-200 font-bold">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'downloads' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl font-sans"
              >
                {[
                  { title: 'Technical Datasheet PDF', desc: 'Wiring templates, full dimensions schematic, CAD compatibility tables.', type: 'Technical Datasheet' },
                  { title: 'Product Catalog & Brochure', desc: 'Alternate product variants, options matrix, accessories, scaling models.', type: 'Product Brochure' },
                  { title: 'Vendor Compliance & Certifications', desc: 'ISO 9001 factory audits, safety sheets, material declarations.', type: 'Compliance Certification' },
                  { title: 'Corporate Sample Invoice', desc: 'Sample billing parameters, tax details, and payment conditions.', type: 'Sample Invoice' }
                ].map((doc, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 border border-border-subtle dark:border-zinc-800 rounded-[4px] bg-white dark:bg-zinc-900/10 flex items-start justify-between gap-4 group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#346941]" />
                        <h4 className="font-bold text-sm text-ink-black dark:text-white group-hover:text-[#346941] transition-colors">{doc.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-450 leading-relaxed">{doc.desc}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc(doc.type)}
                      className="p-2 border border-border-subtle dark:border-zinc-800 hover:bg-[#F0EBE5] dark:hover:bg-zinc-850 hover:text-ink-black transition-colors rounded-[2px]"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4 text-zinc-500 hover:text-ink-black dark:hover:text-white" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'seller' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-12 font-sans"
              >
                <div className="md:col-span-4 flex flex-col items-center text-center p-6 border border-border-subtle dark:border-zinc-800 rounded-[4px] bg-white dark:bg-zinc-900/10">
                  <div className="h-20 w-20 border border-border-subtle dark:border-zinc-800 rounded-[4px] flex items-center justify-center mb-4 bg-zinc-50 dark:bg-zinc-950 font-heading text-3xl font-bold text-zinc-500">
                    {sellerCompanyName.charAt(0)}
                  </div>
                  <h4 className="font-bold text-lg text-ink-black dark:text-white">{sellerCompanyName}</h4>
                  <p className="text-xs text-zinc-450 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{sellerLocation}</span>
                  </p>
                  
                  {sellerIsVerified && (
                    <span className="mt-3 bg-emerald-50 dark:bg-emerald-950/20 text-[#346941] border border-[#346941]/20 text-[9px] font-monoenterprise uppercase px-3 py-1 font-bold tracking-widest rounded-[2px]">
                      Verified Supplier
                    </span>
                  )}
                </div>

                <div className="md:col-span-8 space-y-6">
                  <div>
                    <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white mb-2">Company Overview</h3>
                    <p className="text-zinc-600 dark:text-zinc-450 leading-relaxed text-sm">
                      {sellerAbout}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-border-subtle dark:border-zinc-800 pt-6 text-center">
                    <div>
                      <p className="text-xl font-heading text-ink-black dark:text-white font-medium">99.2%</p>
                      <p className="font-monoenterprise text-[8px] uppercase tracking-widest text-zinc-450">Fulfillment Rate</p>
                    </div>
                    <div>
                      <p className="text-xl font-heading text-ink-black dark:text-white font-medium">&lt; 12 Hours</p>
                      <p className="font-monoenterprise text-[8px] uppercase tracking-widest text-zinc-450">Response Time</p>
                    </div>
                    <div>
                      <p className="text-xl font-heading text-ink-black dark:text-white font-medium">7 Years</p>
                      <p className="font-monoenterprise text-[8px] uppercase tracking-widest text-zinc-450">In Business</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={handleOpenInquiry}
                      className="bg-ink-black text-white hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 font-monoenterprise text-[10px] uppercase tracking-widest px-6 py-3 rounded-[4px] cursor-pointer font-bold"
                    >
                      Contact Seller
                    </button>
                    <button 
                      onClick={handleOpenRfq}
                      className="border border-border-subtle dark:border-zinc-800 hover:border-zinc-500 font-monoenterprise text-[10px] uppercase tracking-widest px-6 py-3 rounded-[4px] cursor-pointer"
                    >
                      Generate RFQ
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section className="mb-24 pt-16 border-t border-border-subtle dark:border-zinc-800">
          <div className="flex justify-between items-baseline mb-12">
            <div>
              <span className="font-monoenterprise text-[10px] uppercase tracking-widest text-[#346941] font-bold">Related Inventory</span>
              <h3 className="font-heading text-3xl md:text-4xl text-ink-black dark:text-white mt-1">Frequently Bought Together</h3>
            </div>
            <Link href="/products" className="font-monoenterprise text-[9px] uppercase tracking-widest text-zinc-450 hover:text-ink-black dark:hover:text-white transition-colors border-b border-zinc-400">
              Browse Directory
            </Link>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 rounded-[4px]" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-3/4 rounded-[2px]" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-1/4 rounded-[2px]" />
                </div>
              ))}
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="py-12 border border-dashed border-border-subtle dark:border-zinc-800 text-center text-zinc-400 dark:text-zinc-650 text-sm font-sans rounded-[4px]">
              No similar industrial assets currently listed.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-sans">
              {relatedProducts.map((p) => (
                <div key={p.id} className="group border border-border-subtle dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900/10 rounded-[4px] flex flex-col justify-between hover:border-zinc-400 transition-all">
                  <div className="space-y-3">
                    <div className="relative aspect-[4/5] bg-zinc-50 dark:bg-zinc-950 overflow-hidden rounded-[2px]">
                      <img src={p.image} alt={p.title} className="object-cover w-full h-full grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                    </div>
                    <div>
                      <span className="font-monoenterprise text-[8px] uppercase tracking-wider text-[#346941] block mb-1">{p.category}</span>
                      <h4 className="font-heading text-lg font-bold text-ink-black dark:text-white line-clamp-1 group-hover:underline">
                        <Link href={`/products/${p.slug}`}>{p.title}</Link>
                      </h4>
                      <p className="font-monoenterprise text-[10px] text-zinc-550 mt-1 uppercase" suppressHydrationWarning>₹{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/products/${p.slug}`}
                    className="w-full text-center py-2.5 mt-4 border border-border-subtle dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-ink-black text-[9px] font-monoenterprise uppercase tracking-widest rounded-[2px] transition-colors"
                  >
                    View Specifications
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VERIFIED BUYER REVIEWS & RATINGS SYSTEM */}
        <section className="pt-16 border-t border-border-subtle dark:border-zinc-800">
          <h3 className="font-heading text-3xl md:text-4xl text-ink-black dark:text-white mb-12">
            Verified Customer Reviews
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start font-sans">
            
            {/* Reviews display and breakdowns */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Ratings Summary Breakdown Widget */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-6 border border-border-subtle dark:border-zinc-800 rounded-[4px] bg-[#F0EBE5]/10 dark:bg-zinc-900/10">
                <div className="sm:col-span-4 text-center sm:border-r sm:border-border-subtle dark:sm:border-zinc-800 py-2">
                  <h4 className="font-heading text-6xl text-ink-black dark:text-white font-medium">{averageRating}</h4>
                  <div className="flex justify-center text-amber-500 my-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`h-4 w-4 ${idx < Math.round(Number(averageRating)) ? 'fill-current' : 'text-zinc-200 dark:text-zinc-700'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-monoenterprise uppercase text-zinc-450">{totalReviews} Global Reviews</p>
                </div>

                <div className="sm:col-span-8 space-y-2">
                  {ratingDistribution.map((dist, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="font-monoenterprise text-[10px] text-zinc-400 w-12 text-right">{dist.stars} Star</span>
                      <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-[4px]">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-500" 
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span className="font-monoenterprise text-[10px] text-zinc-400 w-8">{dist.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedbacks reviews list */}
              {reviews.length === 0 ? (
                <div className="rounded-none border border-border-subtle dark:border-zinc-800 p-16 text-center bg-white dark:bg-zinc-900/10 rounded-[4px]">
                  <MessageSquare className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                  <h4 className="font-heading text-xl text-ink-black dark:text-white mb-1">No Feedback Recorded</h4>
                  <p className="text-xs text-zinc-455 font-sans">No corporate feedback has been published for this product yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle dark:divide-zinc-800">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="py-6 flex flex-col md:flex-row gap-5 justify-between items-start"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star 
                                key={idx} 
                                className={`h-3.5 w-3.5 ${idx < rev.rating ? 'fill-current' : 'text-zinc-200 dark:text-zinc-700'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[8px] font-monoenterprise uppercase tracking-wider text-[#346941] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-[2px] font-bold">
                            VERIFIED BUYER
                          </span>
                        </div>
                        
                        <p className="text-sm text-zinc-700 dark:text-zinc-350 leading-relaxed font-sans">
                          {rev.comment}
                        </p>

                        {/* Optional review attachment image display */}
                        {rev.image_path && (
                          <div className="max-w-[160px] rounded-[2px] overflow-hidden border border-border-subtle dark:border-zinc-800 aspect-square bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                            <img src={rev.image_path} alt="Feedback attachment" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-350" />
                          </div>
                        )}

                        <div className="text-[10px] font-monoenterprise uppercase tracking-widest text-zinc-450 flex items-center space-x-3">
                          <span className="text-ink-black dark:text-zinc-350 font-bold flex items-center gap-1">
                            <User className="h-3 w-3 text-zinc-400" />
                            <span>{rev.user.name}</span>
                          </span>
                          <span>•</span>
                          <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 md:mt-0 self-end md:self-start">
                        <button
                          onClick={() => handleVoteHelpful(rev.id)}
                          disabled={votedReviews[rev.id]}
                          className={`flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle dark:border-zinc-800 text-[10px] font-monoenterprise uppercase rounded-[2px] transition-colors ${
                            votedReviews[rev.id] 
                              ? 'text-[#346941] bg-emerald-50/50 dark:bg-emerald-950/10' 
                              : 'text-zinc-400 hover:text-ink-black dark:hover:text-white hover:border-zinc-400'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>Helpful ({reviewVotes[rev.id] || 0})</span>
                        </button>

                        {/* Edit/Delete actions for authorized authors */}
                        {isAuthenticated && user && Number(user.id) === Number(rev.user.id) && (
                          <div className="flex items-center border border-border-subtle dark:border-zinc-800 rounded-[2px]">
                            <button
                              onClick={() => handleEditReview(rev)}
                              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-400 hover:text-ink-black dark:hover:text-white transition-colors"
                              title="Edit Review"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-2 border-l border-border-subtle dark:border-zinc-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-400 transition-colors"
                              title="Remove Review"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review feedback publisher/form */}
            <div className="lg:col-span-5 rounded-[4px] border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
              <h4 className="font-heading text-xl font-medium text-ink-black dark:text-white mb-6">
                {editingReviewId ? 'Edit Review' : 'Write a Review'}
              </h4>

              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {reviewError && (
                    <div className="p-3 text-[10px] font-monoenterprise uppercase tracking-wider text-red-650 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50 rounded-[2px]">
                      {reviewError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2">
                      Score Rating
                    </label>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-zinc-200 hover:text-amber-400 dark:text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Star className={`h-6 w-6 ${star <= rating ? 'fill-current text-amber-500' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2">
                      Detailed Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comment on industrial tolerances, dimensions fidelity, dispatch speed and vendor communication..."
                      className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white placeholder-zinc-400 outline-none transition-all focus:border-ink-black dark:focus:border-white focus:ring-0"
                    />
                  </div>

                  {/* Image Attachment (Optional URL) */}
                  <div>
                    <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2 flex items-center space-x-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Review Image URL (Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={reviewImageUrl}
                      onChange={(e) => setReviewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... (industrial catalog image)"
                      className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white placeholder-zinc-400 outline-none transition-all focus:border-ink-black dark:focus:border-white focus:ring-0"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full flex items-center justify-center gap-2 rounded-[4px] bg-ink-black hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 py-3.5 text-xs font-monoenterprise uppercase tracking-widest transition-all cursor-pointer font-bold"
                  >
                    {submittingReview ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>{editingReviewId ? 'Update Feedback' : 'Publish Feedback'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setComment('');
                        setRating(5);
                        setReviewImageUrl('');
                      }}
                      className="w-full text-center text-xs font-monoenterprise uppercase tracking-wider text-zinc-400 hover:text-ink-black dark:hover:text-white mt-2 cursor-pointer"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs font-monoenterprise uppercase tracking-wider text-zinc-400 leading-relaxed mb-4">
                    Reviews are limited to verified corporate buyers of this asset.
                  </p>
                  <Link href="/auth/login" className="bg-ink-black text-white font-monoenterprise text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-[4px] block dark:bg-white dark:text-zinc-950 font-bold">
                    Authenticate Account
                  </Link>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>


      {/* RFQ Submission Dialog Modal */}
      <AnimatePresence>
        {showRfqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-lg rounded-[4px] border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowRfqModal(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-ink-black dark:hover:text-white cursor-pointer font-bold text-sm font-monoenterprise"
              >
                ✕ CLOSE
              </button>

              {!rfqSuccess ? (
                <>
                  <div className="mb-6 space-y-1">
                    <span className="bg-[#346941]/10 text-[#346941] text-[8px] px-2 py-0.5 rounded-[2px] font-monoenterprise font-bold uppercase tracking-wider">
                      RFQ Channel
                    </span>
                    <h3 className="font-heading text-3xl font-medium text-ink-black dark:text-white">
                      Request a Quote
                    </h3>
                  </div>

                  <form onSubmit={handleSubmitRfq} className="space-y-6">
                    {/* Quantity Picker */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2">
                          Quantity Required ({product.unit || 'units'})
                        </label>
                        <input
                          type="number"
                          required
                          min={product.min_order_quantity || 1}
                          value={rfqQty}
                          onChange={(e) => setRfqQty(parseInt(e.target.value) || 1)}
                          className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white outline-none focus:border-ink-black dark:focus:border-white focus:ring-0"
                        />
                      </div>

                      {/* Target Price */}
                      <div>
                        <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-455 mb-2">
                          Target Price per Unit (₹)
                        </label>
                        <input
                          type="number"
                          value={rfqTargetPrice}
                          onChange={(e) => setRfqTargetPrice(e.target.value)}
                          placeholder={`Standard: ₹${unitPrice}`}
                          className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white outline-none focus:border-ink-black dark:focus:border-white focus:ring-0"
                        />
                      </div>
                    </div>

                    {/* Inquiry description */}
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2">
                        Sourcing Inquiry Details
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={rfqDescription}
                        onChange={(e) => setRfqDescription(e.target.value)}
                        className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white placeholder-zinc-400 outline-none focus:border-ink-black dark:focus:border-white focus:ring-0"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingRfq}
                      className="w-full flex items-center justify-center gap-2 rounded-[4px] bg-ink-black hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 py-4 text-xs font-monoenterprise uppercase tracking-widest transition-all cursor-pointer font-bold"
                    >
                      {submittingRfq ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>Submit RFQ Sourcing</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white mb-1">RFQ Dispatched</h3>
                  <p className="text-xs text-zinc-450 font-sans">The seller has been notified. Check the RFQ board on your dashboard.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT SELLER / DIRECT INQUIRY MODAL */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-lg rounded-[4px] border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowInquiryModal(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-ink-black dark:hover:text-white cursor-pointer font-bold text-sm font-monoenterprise"
              >
                ✕ CLOSE
              </button>

              {!inquirySuccess ? (
                <>
                  <div className="mb-6 space-y-1">
                    <span className="bg-[#346941]/10 text-[#346941] text-[8px] px-2 py-0.5 rounded-[2px] font-monoenterprise font-bold uppercase tracking-wider">
                      Supplier Contact
                    </span>
                    <h3 className="font-heading text-3xl font-medium text-ink-black dark:text-white">
                      Direct Vendor Inquiry
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-sans">Inquiring with: {sellerCompanyName}</p>
                  </div>

                  <form onSubmit={handleSubmitInquiry} className="space-y-6">
                    {/* Quantity Picker */}
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2">
                        Estimated Order Quantity ({product.unit || 'units'})
                      </label>
                      <input
                        type="number"
                        required
                        min={product.min_order_quantity || 1}
                        value={inquiryQty}
                        onChange={(e) => setInquiryQty(e.target.value)}
                        className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white outline-none focus:border-ink-black dark:focus:border-white focus:ring-0"
                      />
                    </div>

                    {/* Inquiry Message */}
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-widest text-zinc-450 mb-2">
                        Inquiry Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full rounded-[2px] border border-border-subtle dark:border-zinc-800 bg-transparent py-3 px-4 text-xs font-sans text-ink-black dark:text-white placeholder-zinc-400 outline-none focus:border-ink-black dark:focus:border-white focus:ring-0"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="w-full flex items-center justify-center gap-2 rounded-[4px] bg-ink-black hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 py-4 text-xs font-monoenterprise uppercase tracking-widest transition-all cursor-pointer font-bold"
                    >
                      {submittingInquiry ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>Transmit Inquiry</span>
                          <MessageCircle className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-2xl font-medium text-ink-black dark:text-white mb-1">Inquiry Dispatched</h3>
                  <p className="text-xs text-zinc-450 font-sans">The seller has been notified via email and chat. They will contact you shortly.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
