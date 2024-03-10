/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */
package com.infiniteautomation.mango.webapp;

import java.io.IOException;
import java.net.URL;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import com.infiniteautomation.mango.webapp.filters.MangoCacheControlHeaderFilter;
import com.infiniteautomation.mango.webapp.filters.MangoCacheControlHeaderFilter.CacheControlLevel;
import com.serotonin.m2m2.web.mvc.spring.security.BrowserRequestMatcher;

/**
 * Re-writes requests from /ui/ to /modules/mangoUI/web/
 * A request to /ui/non/existing will be rewritten to /modules/mangoUI/web/
 * @author Jared Wiltshire
 */
@Component
@WebFilter(
        asyncSupported = true,
        urlPatterns = {VUIForwardingFilter.FORWARD_FROM_PATH + "/*"},
        dispatcherTypes = {DispatcherType.REQUEST, DispatcherType.FORWARD, DispatcherType.ASYNC})


public class VUIForwardingFilter implements Filter {
    public static final String ORIG_FORWARD_FROM_PATH = "/ui";
    public static final String ORIG_FORWARD_TO_PATH = "/modules/mangoUI/web";
    public static final String FORWARD_FROM_PATH = "/vui";
    public static final String FORWARD_TO_PATH = "/modules/mangoVUI/web";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestURI = httpRequest.getRequestURI();
        
            if (requestURI.startsWith(FORWARD_FROM_PATH)) {
                String relativePath = requestURI.substring(FORWARD_FROM_PATH.length());
                URL resourceUrl = httpRequest.getServletContext().getResource(FORWARD_TO_PATH + relativePath);

                // if the resource is not an actual file we return the index.html file so the webapp can display a 404 not found message
                // only redirect to the index.html file if it's a browser request
                if (resourceUrl == null && BrowserRequestMatcher.INSTANCE.matches(httpRequest)) {
                    relativePath = "/";
                }

                // if ("/serviceWorker.js".equals(relativePath) || "/".equals(relativePath)) {
                //     // use max-age=0 for serviceWorker.js and index.html
                //     httpRequest.setAttribute(MangoCacheControlHeaderFilter.CACHE_OVERRIDE_SETTING, CacheControlLevel.DEFAULT);
                // }

                httpRequest.getRequestDispatcher(FORWARD_TO_PATH + relativePath).forward(httpRequest, httpResponse);
            } 
            
        else
        {
            chain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {
    }
}
