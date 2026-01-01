package com.feelarchive.geo;

import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Location {
  BigDecimal latitude;
  BigDecimal longitude;
  String address;
}
