package com.feelarchive.api.emotion.controller.response;

import com.feelarchive.domain.emotion.entity.Emotion;

public record EmotionWeatherResponse(
    int rank,
    Emotion emotion,
    int count
) {
}
