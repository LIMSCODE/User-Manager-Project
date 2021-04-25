package com.onlinepowers.springmybatis.api.manager;

import com.onlinepowers.springmybatis.user.User;
import com.onlinepowers.springmybatis.util.UserUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Slf4j
@RestController
public class OpmanagerApiController {

	/**
	 * 관리자 메인 페이지
	 * @param user
	 * @param session
	 * @param model
	 * @return
	 */
	@GetMapping("/opmanager")
	public ModelAndView managerMain(User user, HttpSession session, Model model) {

		User loginUser = UserUtils.getLoginUser(session);

		ModelAndView mv = new ModelAndView();
		//로그인안됬거나, 유저일때
		if (loginUser == null || UserUtils.isUserLogin(session)) {
			mv.setViewName("/opmanager/user/login");
			return mv;
		}

		//관리자일때
		mv.addObject("loginUser", loginUser);
		mv.setViewName("/opmanager/index");
		return mv;
	}

}
