<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealEntry extends Model
{
    protected $fillable = [
        'user_id',
        'person',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
