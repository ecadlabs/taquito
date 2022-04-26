import React, { useState } from 'react';
import parse from 'html-react-parser';
import { useMailChimp } from 'react-use-mailchimp-signup';
import styles from './FooterForm.module.scss';

function Feature() {
  const { error, loading, status, subscribe, message } = useMailChimp({
    action: `https://ecadlabs.us20.list-manage.com/subscribe/post?u=8fdd00e1ab81d5f5550fadb32&amp;id=de1bfb4af9`,
  });

  const [inputs, setInputs] = useState({
    'group[218840]': '2',
    value: 2,
  });

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (inputs) {
      subscribe(inputs);
    }
  };

  return (
    <>
      <div className={styles.footerForm}>
        {error && <h6>Please enter your email</h6>}
        {loading && <p>...Loading</p>}
        {message && <p>{message && parse(message)}</p>}

        <h5 className={styles.footerFormTitle}>Register for updates</h5>
        <form className={styles.footerInputContainer} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="mchimpEmail"
            placeholder="Your email address"
            onChange={handleInputChange}
            className={styles.footerEmail}
          />
          <button className={styles.signupButton} type="submit">
            Sign up
          </button>
        </form>
      </div>
    </>
  );
}

export default function FooterForm() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Feature />
      </div>
    </section>
  );
}
