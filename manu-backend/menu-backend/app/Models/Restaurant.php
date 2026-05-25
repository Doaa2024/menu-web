<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name','address','phone',
        'logo','cover_image',
        'instagram','whatsapp'
    ];
}
