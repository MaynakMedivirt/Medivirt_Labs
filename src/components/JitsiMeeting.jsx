import React, { useEffect, useRef } from 'react';

const JitsiMeeting = ({ roomName }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: true,
        SHOW_WATERMARK_FOR_GUESTS: true,
        DEFAULT_BACKGROUND: '#f0f0f0',
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'e2ee'
        ],
        JITSI_WATERMARK_LINK: 'https://medivirt.com/static/media/Medivirt.aa6fab5cce6b660ab2e2.png', // URL of your custom logo
        DEFAULT_LOGO_URL: 'https://img.freepik.com/free-vector/vector-bright-splashes_2065-436.jpg?size=338&ext=jpg&ga=GA1.1.1788068356.1716422400&semt=ais_user',     // URL of your custom logo
        BRAND_WATERMARK_LINK: 'https://medivirt.com/static/media/Medivirt.aa6fab5cce6b660ab2e2.png',
        SHOW_BRAND_WATERMARK: false,
      
      },
      configOverwrite: {
        disableDeepLinking: true,
      },
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => api.dispose();
  }, [roomName]);

  return <div ref={jitsiContainerRef} style={{ height: '100vh', width: '100%' }} />;
};

export default JitsiMeeting;