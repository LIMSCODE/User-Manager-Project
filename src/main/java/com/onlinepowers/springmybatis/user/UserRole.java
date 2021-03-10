package com.onlinepowers.springmybatis.user;

import com.onlinepowers.springmybatis.paging.Criteria;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRole extends Criteria {

    public long userId;
    public String authority;

    public String getAuthorityTitle() {
        if (this.authority == null) {
            return " ";
        } else {
            return "1".equals (this.authority) ? "관리자" : "회원" ;
        }
    }

}