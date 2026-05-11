<?php

namespace App\Repositories;

use App\Models\Cart;
use Illuminate\Database\Eloquent\Model;

class CartRepository extends EloquentBaseRepository
{
    public function __construct(Cart $model)
    {
        parent::__construct($model);
    }

    public function getCartByUserId(int $userId): ?Model
    {
        // Creates cart automatically if user accesses and lacks one.
        return $this->model->with('items.product')->firstOrCreate(['user_id' => $userId]);
    }
}
