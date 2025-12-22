package com.feelarchive.api.archive.repository;

import com.feelarchive.api.archive.domain.ArchiveImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveImageRepository extends JpaRepository<ArchiveImage, Long> {

}
