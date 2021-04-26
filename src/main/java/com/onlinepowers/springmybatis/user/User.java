package com.onlinepowers.springmybatis.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.onlinepowers.springmybatis.paging.JpaPaging;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.ArrayList;
import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "OP_USER")
@DynamicUpdate
public class User implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private long pagingId;

	@Valid
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch=FetchType.EAGER)
	@JsonManagedReference
	private UserDetail userDetail;

	@NotNull(message = "직위 체크 해주세요")
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch=FetchType.EAGER)
	@JsonManagedReference
	private UserRole userRole;

	@NotEmpty(message = "이름 입력해주세요")
	@Size(max = 12, message = "12글자 이하로 입력하세요")
	@Column(nullable=false)
	private String name;

	@NotEmpty(message = "아이디 입력해주세요")
	@Size(max = 12, message = "12글자 이하로 입력하세요")
	@Pattern(regexp = "^[a-z]+[a-z0-9]{5,19}", message = "아이디는 영문자로 시작하는 6~20자 영문자 또는 숫자이어야 합니다.")
	private String loginId;

	private String password;

	@NotEmpty(message = "이메일 입력해주세요")
	@Size(max = 30, message = "30글자 이하로 입력하세요")
	@Email
	private String email;

	@CreatedDate
	@JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	@Column(nullable = false, updatable = false)
	private String createdDate;

	public void setUserDetail(UserDetail userDetail) {
		this.userDetail = userDetail;
		this.userDetail.setUser(this);
	}

	public void setUserRole(UserRole userRole) {
		this.userRole = userRole;
		this.userRole.setUser(this);
	}


	/**
	 * 스프링 시큐리티 관련
	 * 계정이 갖고있는 권한 목록
	 * @return
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		ArrayList<GrantedAuthority> auth = new ArrayList<>();
		auth.add(new SimpleGrantedAuthority(this.userRole.authority));
		return auth;
	}


	/**
	 * 계정의 비밀번호
	 * @return
	 */
	@Override
	public String getPassword() {
		return this.password;
	}


	/**
	 * 계정의 이름
	 * @return
	 */
	@Override
	public String getUsername() {
		return this.name;
	}


	/**
	 * 계정이 만료되지 않았는 지 (true: 만료안됨)
	 * @return
	 */
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}


	/**
	 * 계정이 잠겨있지 않았는 지
	 * @return
	 */
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}


	/**
	 * 비밀번호가 만료되지 않았는 지
	 * @return
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}


	/**
	 * 계정이 활성화(사용가능)인 지
	 * @return
	 */
	@Override
	public boolean isEnabled() {
		//return ENABLED;
		return true;
	}


}
