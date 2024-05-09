/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */
import {axios} from '@/boot/axios'


    const serverUrl = '/rest/latest/server';
    
    function Server() {
    }
    
    Server.prototype.restart = async function(delay:number) {
        const params:{delay?:number} = {};
        if (Number.isFinite(delay) && delay >= 0) {
            params.delay = delay;
        }
        
        return await axios({
            method: 'put',
            url: serverUrl + '/restart',
            params
        }).then(function(response) {
            return response.data;
        });
    };

    Server.prototype.sendTestEmail = async function(toEmail:string, usernameInEmail:string) {
        return await axios({
            url: serverUrl + '/email/test',
            params: {
                username: usernameInEmail,
                email: toEmail
            },
            method: 'put'
        });
    };
    
    Server.prototype.getSystemInfo = async function(key:string) {
        let url = serverUrl + '/system-info/';
        if (key) {
            url += encodeURIComponent(key);
        }
        
        return await axios({
            method: 'get',
            url: url
        }).then(function(response) {
            return response.data;
        });
    };

    Server.prototype.sendEmailToMailingList = async function (mailingListXid:string, data:string) {
        return await axios({
            url: `${serverUrl}/email/mailing-list/${mailingListXid}`,
            method: 'POST',
            data: data
        });
    };

export default Server;


