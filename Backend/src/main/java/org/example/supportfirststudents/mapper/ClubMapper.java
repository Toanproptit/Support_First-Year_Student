package org.example.supportfirststudents.mapper;


import org.example.supportfirststudents.dto.request.CreateClub;
import org.example.supportfirststudents.dto.response.ClubResponse;
import org.example.supportfirststudents.entity.Club;
import org.springframework.stereotype.Component;

@Component
public class ClubMapper {


    public Club toClub(CreateClub request) {
        Club club = new Club();
        club.setName(request.getName());
        club.setDescription(request.getDescription());
        club.setLinkWeb(request.getLinkWeb());
        club.setLinkYoutube(request.getLinkYoutube());
        club.setLinkFacebook(request.getLinkFacebook());
        club.setImage(request.getImage());
        club.setHead(request.getHead());
        return club;
    }

    public ClubResponse toClubResponse(Club club) {

        return ClubResponse.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .image(club.getImage())
                .head(club.getHead())
                .description(club.getDescription())
                .linkFacebook(club.getLinkFacebook())
                .linkYoutube(club.getLinkYoutube())
                .linkWeb(club.getLinkWeb())
                .build();
    }
}
