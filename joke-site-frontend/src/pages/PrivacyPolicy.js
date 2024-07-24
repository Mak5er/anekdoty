import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" style={{ padding: '20px', marginTop: '3rem'}}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to [Your Website]! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Collection of Your Information
      </Typography>
      <Typography variant="body1" paragraph>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Personal Data"
            secondary="Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Derivative Data"
            secondary="Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Financial Data"
            secondary="Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site."
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Use of Your Information
      </Typography>
      <Typography variant="body1" paragraph>We may use the information we collect about you in the following ways:</Typography>
      <List>
        <ListItem><ListItemText primary="Create and manage your account" /></ListItem>
        <ListItem><ListItemText primary="Process your transactions" /></ListItem>
        <ListItem><ListItemText primary="Send you marketing and promotional communications" /></ListItem>
        <ListItem><ListItemText primary="Respond to your comments, questions, and provide customer service" /></ListItem>
        <ListItem><ListItemText primary="Monitor and analyze usage and trends to improve your experience with the Site" /></ListItem>
        <ListItem><ListItemText primary="Personalize your experience and deliver content and product offerings relevant to your interests" /></ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Disclosure of Your Information
      </Typography>
      <Typography variant="body1" paragraph>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="By Law or to Protect Rights"
            secondary="If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Business Transfers"
            secondary="We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company."
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Security of Your Information
      </Typography>
      <Typography variant="body1" paragraph>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</Typography>

      <Typography variant="h5" gutterBottom>
        Policy for Children
      </Typography>
      <Typography variant="body1" paragraph>We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you believe we might have any information from or about a child under 13, please contact us.</Typography>

      <Typography variant="h5" gutterBottom>
        Changes to This Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.</Typography>

      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>If you have questions or comments about this Privacy Policy, please contact us at:</Typography>
      <Typography variant="body1">Email: makser@makser.pp.ua</Typography>
    </Container>
  );
};

export default PrivacyPolicy;
