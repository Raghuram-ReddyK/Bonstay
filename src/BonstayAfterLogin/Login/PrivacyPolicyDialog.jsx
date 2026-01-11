import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Button
} from '@mui/material';

const PrivacyPolicyDialog = ({ open, onClose, onAccept }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <h3>Privacy Policy for [Bonstay]</h3>
                    <p><strong>Last Updated: [2024]</strong></p>
                    <p>At [Bonstay], we value your privacy and are committed to protecting the personal data that you provide to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services. By using our services, you agree to the practices described in this policy.</p>

                    <h4>1. Information We Collect</h4>
                    <p>We collect the following types of personal information:</p>
                    <ul>
                        <li><strong>Personal Identification Information:</strong> When you book a room, make a reservation, or subscribe to our newsletter, we may collect your name, email address, phone number, address, payment information, and any special requests for your stay.</li>
                        <li><strong>Technical Data:</strong> We collect information about your devices and usage patterns on our website, such as IP address, browser type, location, and pages visited. This information is collected via cookies and similar technologies to improve the user experience.</li>
                    </ul>

                    <h4>2. How We Use Your Information</h4>
                    <ul>
                        <li>Process and manage your hotel reservation or booking.</li>
                        <li>Communicate with you regarding your booking, special offers, and promotions.</li>
                        <li>Improve the quality of our services and customer support.</li>
                        <li>Analyze website usage to enhance the user experience.</li>
                        <li>Comply with legal obligations or resolve disputes.</li>
                    </ul>

                    <h4>3. Data Sharing</h4>
                    <p>We may share your personal data in the following situations:</p>
                    <ul>
                        <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party partners that help us run our business, such as payment processors, marketing services, and customer support tools.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, in response to a legal request, or to protect our rights, property, or safety, or that of others.</li>
                    </ul>

                    <h4>4. Cookies and Tracking Technologies</h4>
                    <p>We use cookies and similar technologies to enhance the user experience on our website...</p>
                    <li>Remember your preferences.</li>
                    <li>Analyze website traffic.</li>
                    <li>Customize the content you see.</li><br />

                    <h4>5. Security of Your Information</h4>
                    <p>We take the security of your personal information seriously. We implement physical, electronic, and procedural safeguards to protect your data from unauthorized access, alteration, or destruction. However, please note that no method of transmission over the internet is completely secure.</p>

                    <h4>6. Data Retention</h4>
                    <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>

                    <h4>7. Your Rights</h4>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access the personal information we hold about you.</li>
                        <li>Correct any inaccurate or incomplete data.</li>
                        <li>Request the deletion of your personal data, subject to certain exceptions.</li>
                        <li>Opt-out of marketing communications by following the unsubscribe instructions in our emails.</li>
                    </ul>

                    <span>To exercise any of these rights, please contact us at [hotel contact information].</span><br /><br />

                    <h4>8. Children's Privacy</h4>
                    <p>Our services are not intended for children under the age of 13. We do not knowingly collect or maintain personal information from children under 13. If we become aware that we have inadvertently collected information from a child under 13, we will take steps to delete such information.</p>

                    <h4>9. Changes to This Privacy Policy</h4>
                    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last Updated" date will be revised accordingly. We encourage you to review this policy periodically to stay informed about how we are protecting your information.</p>

                    <h4>10. Contact Us</h4>
                    <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                    <ul>
                        <li><strong>Email:</strong> [info@bonstay.com]</li>
                        <li><strong>Phone:</strong> [+91-3485933941]</li>
                        <li><strong>Address:</strong> [SRT-121, Oppo to Cure Hospital, Gachibowli, Hyderabad]</li>
                    </ul>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                <Button onClick={onAccept} variant="contained" color="primary">
                    I Accept
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PrivacyPolicyDialog;
