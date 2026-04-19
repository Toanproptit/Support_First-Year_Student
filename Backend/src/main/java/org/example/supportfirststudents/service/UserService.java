package org.example.supportfirststudents.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.CreateUser;
import org.example.supportfirststudents.dto.request.UpdateUser;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.dto.response.UserResponse;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.enums.Role;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.UserMapper;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;


    @Transactional
    public UserResponse create(CreateUser request) {

        if(userRepository.existsByUserName(request.getUsername())){
            throw new Appexception(ErrorCode.USERNAME_EXISTED);
        }

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new Appexception(ErrorCode.EMAIL_EXISTED);
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setUserName(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        if(request.getRole() == null){
            user.setRole(Role.Student);
        }
        else {
            user.setRole(request.getRole());
        }
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse findById(Long id) {
        return userMapper.toUserResponse(getUser(id));
    }

    public List<UserResponse> findByUsername(String username) {
        return userMapper.toUserResponse(userRepository.findByUserNameContaining(username));
    }

    public PageResponse<UserResponse> findAll(int page , int size) {
        log.info("Find All Users");
        int validatePage = Math.max(page,0);
        int validateSize = size <= 0 ? 10:Math.min(size,100);

        Page<User> userPage = userRepository.findAll(
                PageRequest.of(validatePage,validateSize, Sort.by(Sort.Direction.ASC,"userName"))
        );

        List<UserResponse> content = userPage.getContent()
                .stream().map(userMapper ::toUserResponse).toList();
        return PageResponse.<UserResponse>builder()
                .results(content)
                .page(page)
                .size(size)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .last(userPage.isLast())
                .build();
    }


    @Transactional(rollbackOn =  Appexception.class)
    public UserResponse update(Long id , UpdateUser request) {
        User oldUser = getUser(id);

        // Kiểm tra userName mới có trùng với user khác không
        if(!oldUser.getUserName().equals(request.getUsername())
                && userRepository.existsByUserName(request.getUsername())) {
            throw new Appexception(ErrorCode.USERNAME_EXISTED);
        }

        // Kiểm tra email mới có trùng với user khác không
        if(!oldUser.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new Appexception(ErrorCode.EMAIL_EXISTED);
        }

        oldUser.setFullName(request.getFullName());
        oldUser.setUserName(request.getUsername());
        oldUser.setPassword(request.getPassword());
        oldUser.setEmail(request.getEmail());
        if(request.getRole() == null){
            oldUser.setRole(Role.Student);
        }
        else {
            oldUser.setRole(request.getRole());
        }
        return userMapper.toUserResponse(userRepository.save(oldUser));
    }

    @Transactional(rollbackOn =  Appexception.class)
    public void delete(Long id) {
        User user = getUser(id);
        userRepository.delete(user);
    }


    private User getUser(Long id){
        return userRepository.findById(id).orElseThrow(()-> new Appexception(ErrorCode.USER_NOT_FOUND));
    }


}
