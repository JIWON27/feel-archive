package com.feelarchive.api.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class DateUtils {

  public static final ZoneId KST = ZoneId.of("Asia/Seoul");
  public static final DateTimeFormatter YYYY_MM_DD = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(KST);
  public static final DateTimeFormatter YYYY_MM_DD_HH_MM = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(KST);;

  private DateUtils() {
    throw new IllegalStateException("DateUtils 클래스로 인스턴스화가 필요없습니다.");
  }

  public static String formatToDate(LocalDateTime time) {
    if (time == null) return "";
    return time.format(YYYY_MM_DD);
  }

  public static String formatToDateTime(LocalDateTime time) {
    if (time == null) return "";
    return time.format(YYYY_MM_DD_HH_MM);
  }

  public static String formatToCustomDate(LocalDateTime time, String pattern) {
    if (time == null) return "";
    return time.format(DateTimeFormatter.ofPattern(pattern).withZone(KST));
  }

  public static Instant getEndOfToday() {
    return LocalDate.now(KST).plusDays(1).atStartOfDay(KST).toInstant();
  }

}
