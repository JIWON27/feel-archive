package com.feelarchive.api.common.response;

import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;

@Getter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PagingResponse<T> {
  List<T> content;
  int pageNo;
  int pageSize;
  long totalElements;
  int totalPages;
  boolean last;

  public static <T> PagingResponse<T> of(Page<T> page) {
    return PagingResponse.<T>builder()
        .content(page.getContent())
        .pageNo(page.getNumber()+1)
        .pageSize(page.getSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .last(page.isLast())
        .build();
  }
}
