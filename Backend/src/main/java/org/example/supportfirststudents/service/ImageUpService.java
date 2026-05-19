package org.example.supportfirststudents.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.config.CloudinaryConfig;
import org.example.supportfirststudents.dto.response.UploadImageResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageUpService {

    Cloudinary cloudinary;

    public UploadImageResponse uploadImage(MultipartFile file ,String folderName) throws IOException {
        if(file.isEmpty() || file == null) {
            throw  new IllegalArgumentException("file is empty");
        }

        String contentType = file.getContentType();
        if(contentType == null || !contentType.contains("image")) {
            throw  new IllegalArgumentException("Only image files are allowed");
        }

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folderName,
                        "resource_type", "image"
                )
        );


        String url = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");

        return UploadImageResponse.builder()
                .url(url)
                .publicId(publicId)
                .build();
    }
}
