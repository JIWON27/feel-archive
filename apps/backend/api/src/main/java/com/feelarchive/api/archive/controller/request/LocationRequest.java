package com.feelarchive.api.archive.controller.request;

import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class LocationRequest {
  BigDecimal latitude;
  BigDecimal longitude;
  String locationLabel;
}
