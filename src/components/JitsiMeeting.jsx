import React, { useEffect, useRef } from 'react';

const JitsiMeeting = ({ roomName, onLeave }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.body.appendChild(script);
    };

    const initializeJitsi = () => {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        parentNode: jitsiContainerRef.current,
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#f0f0f0',
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'e2ee'
          ],
          JITSI_WATERMARK_LINK: 'https://your-website.com',
          DEFAULT_LOGO_URL: 'https://your-website.com/your-custom-logo.png',
          DEFAULT_WELCOME_PAGE_LOGO_URL: 'https://your-website.com/your-custom-logo.png',
          BRAND_WATERMARK_LINK: 'https://your-website.com',
          SHOW_BRAND_WATERMARK: true,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        },
        configOverwrite: {
          disableDeepLinking: true,
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          enableWelcomePage: false,
          // This function will be called when the user clicks on the "Leave" button
          onload: () => {
            const leaveButton = document.querySelector('.toolbox-button.hangup');
            if (leaveButton) {
              leaveButton.addEventListener('click', () => {
                window.location.href = 'https://medivirt.com';
              });
            }
          }
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      return () => api.dispose();
    };

    if (!window.JitsiMeetExternalAPI) {
      loadJitsiScript();
    } else {
      initializeJitsi();
    }
  }, [roomName]);

  return <div ref={jitsiContainerRef} style={{ height: '100vh', width: '100%' }} />;
};
export default JitsiMeeting;
