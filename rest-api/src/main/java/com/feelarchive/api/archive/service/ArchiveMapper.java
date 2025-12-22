package com.feelarchive.api.archive.service;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.user.domain.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ArchiveMapper {
  Archive toArchive(User user, ArchiveRequest request);
}
