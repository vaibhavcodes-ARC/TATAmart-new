import { redirect } from 'next/navigation';

export default function Page() {
  // Preserve old route: redirect to the new page
  redirect('/from-the-developers');
}
