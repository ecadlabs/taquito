import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';

export default () => {
    const context = useDocusaurusContext();
    const { siteConfig } = context;
    const { customFields } = siteConfig;

    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            permalink="/"
            description={customFields.description}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <iframe
                    src="https://www.chatbase.co/chatbot-iframe/Cn650xmUdORPNUE8fcKlg"
                    width="90%"
                    style={{ height: '100%', minHeight: '700px' }}
                    frameborder="0"
                ></iframe>
            </div>
        </Layout>
    );
}