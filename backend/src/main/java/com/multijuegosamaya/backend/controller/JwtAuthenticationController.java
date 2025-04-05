package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.JwtRequest;
import com.multijuegosamaya.backend.dto.JwtResponse;
import com.multijuegosamaya.backend.security.JwtTokenUtil;
import com.multijuegosamaya.backend.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JwtAuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @PostMapping("/api/authenticate")
    public JwtResponse createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {

        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

        final UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(authenticationRequest.getUsername());

        final String token = jwtTokenUtil.generateToken(userDetails);

        Long userId = jwtUserDetailsService.getUserId(authenticationRequest.getUsername());

        return new JwtResponse(token, userId);
    }

    private void authenticate(String username, String password) throws Exception {
      try{
          authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
      } catch (DisabledException e) {
          throw new Exception("Invalid Credentials", e);
      }
    }
}
