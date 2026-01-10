package com.feelarchive.domain.capsule.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum CapsuleStatus {
  LOCKED,
  OPENED
  ;
}
