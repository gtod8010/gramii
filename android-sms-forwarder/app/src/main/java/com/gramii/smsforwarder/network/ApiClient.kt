package com.gramii.smsforwarder.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val httpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    // We need a base URL for Retrofit, but since we use a dynamic @Url, 
    // this can be any valid URL. It won't be used for the actual request.
    private val retrofit = Retrofit.Builder()
        .baseUrl("http://localhost/") 
        .addConverterFactory(GsonConverterFactory.create())
        .client(httpClient)
        .build()

    val instance: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
} 
