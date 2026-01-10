package com.feelarchive.api.capsule.controller.response;

public record TimeCapsuleImageResponse(
  Long id,
  String url
){
  public static TimeCapsuleImageResponse of( Long id, String url) {
    return new TimeCapsuleImageResponse(id, url);
  }
}

