package com.feelarchive.domain.archive.entity.vo;

import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.LATITUDE_OUT_OF_RANGE;
import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.LOCATION_COORDINATES_REQUIRED;
import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.LONGITUDE_OUT_OF_RANGE;

import com.feelarchive.common.excepion.FeelArchiveException;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@Embeddable
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Location {

  private static final BigDecimal MIN_LAT = new BigDecimal("-90");
  private static final BigDecimal MAX_LAT = new BigDecimal("90");
  private static final BigDecimal MIN_LON = new BigDecimal("-180");
  private static final BigDecimal MAX_LON = new BigDecimal("180");

  @Column(name = "latitude", precision = 10, scale = 7)
  BigDecimal latitude;

  @Column(name = "longitude", precision = 10, scale = 7)
  BigDecimal longitude;

  @Column(name = "location_label", length = 100)
  String locationLabel;

  @Builder
  public Location(BigDecimal latitude, BigDecimal longitude, String locationLabel) {
    validate(latitude, longitude);

    this.latitude = latitude;
    this.longitude = longitude;
    this.locationLabel = locationLabel;
  }

  private void validate(BigDecimal lat, BigDecimal lon) {
    if (lat == null && lon == null) return;

    if (lat == null || lon == null) {
      throw new FeelArchiveException(LOCATION_COORDINATES_REQUIRED);
    }

    if (lat.compareTo(MIN_LAT) < 0 || lat.compareTo(MAX_LAT) > 0) {
      throw new FeelArchiveException(LATITUDE_OUT_OF_RANGE);
    }

    if (lon.compareTo(MIN_LON) < 0 || lon.compareTo(MAX_LON) > 0) {
      throw new FeelArchiveException(LONGITUDE_OUT_OF_RANGE);
    }
  }
}
