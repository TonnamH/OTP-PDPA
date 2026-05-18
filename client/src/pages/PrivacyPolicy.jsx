// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();

  // Styles for the legal document
  const pageStyle = { backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '4rem 1rem' };
  const containerStyle = { maxWidth: '1400px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-elegant)' };
  const h2Style = { fontSize: '1.4rem', color: 'var(--primary-navy)', fontFamily: 'Prompt, sans-serif', marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--bg-light)', paddingBottom: '0.5rem' };
  const pStyle = { fontSize: '1rem', color: 'var(--text-dark)', fontFamily: 'Sarabun, sans-serif', lineHeight: '1.8', marginBottom: '1rem' };
  const ulStyle = { ...pStyle, paddingLeft: '2rem', marginBottom: '1.5rem' };
  const liStyle = { marginBottom: '0.5rem' };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)' }}>
            {t('privacyPolicyPage.title')}
          </h1>
          <p style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
            {t('privacyPolicyPage.lastUpdated')}
          </p>
        </div>

        {/* THAI VERSION */}
        {i18n.language === 'th' && (
          <div>
            <p style={pStyle}>
              เว็บไซต์ของเรา pdpa.otp.go.th เคารพสิทธิความเป็นส่วนตัวของผู้ใช้ทุกคนที่เข้าเว็บไซต์ของเรา จึงขอชี้แจงให้ท่านทราบเกี่ยวกับการใช้งานข้อมูลส่วนบุคคลของท่าน ประกาศนโยบายความเป็นส่วนตัวนี้ใช้สำหรับบุคคลดังต่อไปนี้:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>ผู้ให้บริการหรือเจ้าของเว็บไซต์:</strong> ต่อไปนี้จะเรียกว่า pdpa.otp.go.th</li>
              <li style={liStyle}><strong>ผู้เยี่ยมชมเว็บไซต์:</strong> คือ ผู้ที่เปิดหน้าเว็บไซต์ หรือ อ่านข้อมูลบนหน้าเว็บไซต์ pdpa.otp.go.th ไม่ว่าจะเป็นหน้าใดก็ตาม</li>
            </ul>
            <p style={pStyle}>
              เว็บไซต์ pdpa.otp.go.th ได้กำหนดนโยบายเกี่ยวกับข้อมูลส่วนบุคคลเพื่อยกระดับมาตรฐาน ความปลอดภัย ของข้อมูลส่วนบุคคล ของผู้เยี่ยมชม และ ผู้ใช้บริการเว็บไซต์ให้ดียิ่งขึ้น และ เพื่อให้สอดคล้องกับพระราชบัญญัติ คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ดังนั้น เราขอแนะนำให้ท่านอ่านนโยบายคุ้มครองข้อมูลส่วนบุคคลฉบับนี้ เพื่อเรียนรู้และเข้าใจหลักปฏิบัติที่เว็บไซต์ pdpa.otp.go.th ยึดถือในการปฏิบัติต่อข้อมูลส่วนบุคคลของท่าน
            </p>

            <h2 style={h2Style}>วัตถุประสงค์ของการจัดเก็บข้อมูลส่วนบุคคล</h2>
            <p style={pStyle}>pdpa.otp.go.th เก็บข้อมูลส่วนบุคคลของท่านตามวัตถุประสงค์ ของการดำเนินงานเว็บไซต์ดังนี้:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>เพื่อใช้ตรวจสอบผู้ใช้บริการเว็บไซต์ ที่ต้องการเข้าสู่ระบบเว็บไซต์</li>
              <li style={liStyle}>เพื่อใช้เป็นข้อมูลในการติดต่อกลับผู้ใช้บริการเว็บไซต์</li>
              <li style={liStyle}>เพื่อใช้ตรวจสอบและรักษาความปลอดภัยของระบบเว็บไซต์</li>
            </ul>

            <h2 style={h2Style}>ข้อมูลส่วนบุคคลที่เว็บไซต์จัดเก็บ</h2>
            <p style={pStyle}>เว็บไซต์ pdpa.otp.go.th จัดเก็บข้อมูลส่วนบุคคลของท่าน ผ่านการใช้บริการเว็บไซต์ และ การลงทะเบียนโดยข้อมูลที่เราจัดเก็บมีดังนี้:</p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>ข้อมูลสำหรับเข้าสู่ระบบเว็บไซต์:</strong> ได้แก่ ชื่อผู้ใช้งานที่ผู้ใช้บริการเว็บไซต์ตั้งขึ้น หรือ ระบบสร้างให้อัตโนมัติ และ รหัสผ่านที่ผู้ใช้บริการเว็บไซต์ตั้งขึ้น</li>
              <li style={liStyle}><strong>ข้อมูลจราจร ทางคอมพิวเตอร์:</strong> ของผู้เยี่ยมชมเว็บไซต์ ใช้สำหรับการวิเคราะห์ และ ปรับแต่งระบบรักษาความปลอดภัยของเว็บไซต์</li>
            </ul>

            <h2 style={h2Style}>การใช้งานคุกกี้ (Cookies)</h2>
            <p style={pStyle}>
              เว็บไซต์ pdpa.otp.go.th มีการใช้งานคุกกี้ เพื่อวัตถุประสงค์ทางการดำเนินงานของเว็บไซต์ ท่านสามารถศึกษาข้อมูลเพิ่มเติมเกี่ยวกับ นโยบายการใช้งานคุกกี้บนเว็บไซต์ pdpa.otp.go.th ได้จาก นโยบายการใช้คุกกี้ (Cookie Policy) ของเรา
            </p>

            <h2 style={h2Style}>ข้อมูลส่วนบุคคลที่จัดเก็บโดยบุคคลที่สาม</h2>
            <p style={pStyle}>เว็บไซต์ pdpa.otp.go.th มีการใช้งาน ซอฟท์แวร์ และ บริการจาก บุคคลที่สาม สำหรับเพิ่มประสิทธิภาพการทำงานของเว็บไซต์ โดยบริการที่เว็บไซต์ใช้มีดังนี้:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Google Analytics</li>
              <li style={liStyle}>Facebook Pixel/Conversion API</li>
              <li style={liStyle}>Google Maps Embedded</li>
              <li style={liStyle}>Youtube Embedded</li>
            </ul>
            <p style={pStyle}>
              กรณีที่มีการเชื่อมโยงกับแพลตฟอร์มของบุคคลที่สาม เช่น เครือข่ายการโฆษณา สื่อสังคมออนไลน์ ผู้ให้บริการเว็บไซต์ภายนอกอื่นๆ คุกกี้บางประเภท และ ข้อมูลจราจรทางคอมพิวเตอร์ อาจมีการจัดการโดยบุคคลที่สาม จึงแนะนำให้ผู้เยี่ยมชมเว็บไซต์ ศึกษาและทำความเข้าใจนโยบายการใช้คุกกี้และนโยบายการคุ้มครองข้อมูลส่วนบุคคลของบุคคลที่สามเพิ่มเติมด้วย
            </p>

            <h2 style={h2Style}>สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
            <ul style={ulStyle}>
              <li style={liStyle}>ผู้ใช้บริการเว็บไซต์มีสิทธิ์ที่จะขอลบข้อมูล ที่ลงทะเบียนอยู่ในระบบ โดยสามารถแจ้งความประสงค์ในการลบข้อมูลได้ ตามช่องทางติดต่อในหัวข้อการติดต่อในนโยบายนี้</li>
              <li style={liStyle}>ผู้เยี่ยมชมเว็บไซต์ สามารถปฎิเสธ การใช้งานคุกกี้ ได้จาก หน้าต่างแจ้งเตือนการใช้งานคุกกี้ ที่หน้าเว็บไซต์</li>
              <li style={liStyle}>ผู้เยี่ยมชมเว็บไซต์ สามารถลบข้อมูลคุกกี้ทั้งหมด ได้จากเว็บบราวเซอร์ที่ผู้เยี่ยมชมเว็บไซต์ ใช้งาน โดยท่านสามารถศึกษาวิธีการลบคุกกี้ ออกจากเว็บบราวเซอร์ จากเว็บไซต์ของผู้พัฒนาเว็บบราวเซอร์นั้น</li>
            </ul>

            <h2 style={h2Style}>ความปลอดภัยของข้อมูลส่วนบุคคล</h2>
            <p style={pStyle}>
              เว็บไซต์ pdpa.otp.go.th ให้ความสำคัญกับข้อมูลส่วนตัวของท่าน และจะใช้มาตรการที่มีประสิทธิภาพเพื่อคุ้มครองข้อมูลของท่านให้ปลอดภัยอยู่เสมอ ดังนั้น เราจึงได้ใช้เทคโนโลยี และกำหนดนโยบายต่างๆ ขึ้นมา โดยมีวัตถุประสงค์ที่จะคุ้มครองข้อมูลส่วนตัวของท่านให้ปลอดภัยจากการลักลอบเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต และจากการนำข้อมูลไปใช้ในทางที่ไม่เหมาะสม เราจะใช้เทคโนโลยีใหม่ที่สามารถหาได้ ณ ขณะที่เราพัฒนาเว็บไซต์ เพื่อปรับปรุงมาตรการเหล่านี้ให้มีประสิทธิภาพมากยิ่งขึ้นในเวลาอันสมควร
            </p>
            <p style={pStyle}>
              บนเว็บไซต์ pdpa.otp.go.th อาจจะมีลิงก์เชื่อมโยงไปยังเว็บไซต์อื่นๆ หรือท่านอาจใช้ลิงก์ในเว็บไซต์อื่นเพื่อเข้ามาในเว็บไซต์ของเรา เราขอให้ท่านเข้าใจว่า เว็บไซต์ pdpa.otp.go.th ไม่สามารถที่จะรับผิดชอบต่อนโยบาย และวิธีการปฏิบัติเกี่ยวกับการคุ้มครองความเป็นส่วนตัวของเว็บไซต์อื่นๆได้ ดังนั้นขอให้ท่านศึกษา นโยบาย และ แนวทางปฏิบัติเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล ของเว็บไซต์ ที่ท่านเยี่ยมชม ก่อนและหลังเยี่ยมชมเว็บไซต์ของเราผ่านลิงก์เชื่อมโยงบนเว็บไซต์ด้วย
            </p>
            <p style={pStyle}>
              อย่างไรก็ตามเว็บไซต์ pdpa.otp.go.th ไม่สามารถที่จะควบคุมดูแล หรือรับผิดชอบต่อการใช้ข้อมูลส่วนตัวโดยบุคคลภายนอก หรือ องค์กรภายนอก ที่ได้รับข้อมูลจากท่านผ่านทางเว็บไซต์นี้ เราจึงขอแนะนำให้ท่านพิจารณา การยอมรับหรือการปฏิเสธการใช้งานคุกกี้ จากบุคคลที่สาม ตามที่เราได้แจ้งข้างต้นถึงสิทธิที่ท่านสามารถปฏิเสธการใช้งานคุกกี้เหล่านี้ได้ด้วยตนเอง
            </p>

            <h2 style={h2Style}>การติดต่อเจ้าหน้าที่</h2>
            <p style={pStyle}>หากท่านมีข้อเสนอแนะ หรือต้องการสอบถามข้อมูลเกี่ยวกับรายละเอียดการเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลส่วนบุคคลของท่าน รวมถึงการขอใช้สิทธิตามนโยบายฉบับนี้ ท่านสามารถติดต่อ ผ่านช่องทางต่อไปนี้:</p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>อีเมล:</strong> compliance@otp.go.th</li>
              <li style={liStyle}><strong>เบอร์โทรศัพท์:</strong> 022151515 ต่อ 4515</li>
            </ul>
            <p style={{ ...pStyle, marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
              จัดทำนโยบายโดย PDPA-OTP (pdpa.otp.go.th)
            </p>
          </div>
        )}

        {/* ENGLISH VERSION */}
        {i18n.language === 'en' && (
          <div>
            <p style={pStyle}>
              Our website, pdpa.otp.go.th, respects the privacy rights of all users who visit our website. Therefore, we would like to clarify how we handle and use your personal data. This privacy policy applies to the following individuals:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Service Provider or Website Owner:</strong> Hereinafter referred to as pdpa.otp.go.th.</li>
              <li style={liStyle}><strong>Website Visitors:</strong> Individuals who open or read any page on the pdpa.otp.go.th website.</li>
            </ul>
            <p style={pStyle}>
              The pdpa.otp.go.th website has established a personal data policy to elevate the security standards of personal data for our visitors and users, and to comply with the Personal Data Protection Act B.E. 2562 (2019). Therefore, we recommend that you read this privacy policy to learn and understand the practices that the pdpa.otp.go.th website adheres to regarding your personal data.
            </p>

            <h2 style={h2Style}>Objectives of Personal Data Collection</h2>
            <p style={pStyle}>pdpa.otp.go.th collects your personal data for the following website operational purposes:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>To verify website users who wish to log into the system.</li>
              <li style={liStyle}>To use as contact information to communicate with website users.</li>
              <li style={liStyle}>To monitor and maintain the security of the website system.</li>
            </ul>

            <h2 style={h2Style}>Personal Data Collected by the Website</h2>
            <p style={pStyle}>The pdpa.otp.go.th website collects your personal data through your use of the website services and registration. The data we collect includes:</p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Website Login Information:</strong> Such as the username created by the user or automatically generated by the system, and the password created by the user.</li>
              <li style={liStyle}><strong>Computer Traffic Data:</strong> Of website visitors, used for analyzing and adjusting the website's security systems.</li>
            </ul>

            <h2 style={h2Style}>Use of Cookies</h2>
            <p style={pStyle}>
              The pdpa.otp.go.th website uses cookies for website operational purposes. You can learn more about the cookie usage policy on the pdpa.otp.go.th website from our Cookie Policy.
            </p>

            <h2 style={h2Style}>Personal Data Collected by Third Parties</h2>
            <p style={pStyle}>The pdpa.otp.go.th website uses software and services from third parties to enhance website performance. The services used by the website include:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Google Analytics</li>
              <li style={liStyle}>Facebook Pixel/Conversion API</li>
              <li style={liStyle}>Google Maps Embedded</li>
              <li style={liStyle}>YouTube Embedded</li>
            </ul>
            <p style={pStyle}>
              In cases where there are links to third-party platforms, such as advertising networks, social media, or other external website providers, certain types of cookies and computer traffic data may be managed by those third parties. Therefore, it is recommended that website visitors also study and understand the cookie policies and personal data protection policies of these third parties.
            </p>

            <h2 style={h2Style}>Rights of the Data Subject</h2>
            <ul style={ulStyle}>
              <li style={liStyle}>Website users have the right to request the deletion of data registered in the system. You can notify your request to delete data through the contact channels provided in the contact section of this policy.</li>
              <li style={liStyle}>Website visitors can refuse the use of cookies through the cookie consent notification window on the website.</li>
              <li style={liStyle}>Website visitors can delete all cookie data from the web browser they are using. You can learn how to delete cookies from your web browser through the browser developer's website.</li>
            </ul>

            <h2 style={h2Style}>Security of Personal Data</h2>
            <p style={pStyle}>
              The pdpa.otp.go.th website values your personal data and will always use effective measures to protect your data securely. Therefore, we have utilized technologies and established various policies with the objective of protecting your personal data from unauthorized access and improper use. We will employ available new technologies as we develop the website to improve these measures efficiently in due course.
            </p>
            <p style={pStyle}>
              The pdpa.otp.go.th website may contain links to other websites, or you may use links from other websites to access ours. We ask you to understand that the pdpa.otp.go.th website cannot be responsible for the policies and privacy protection practices of other websites. Therefore, please study the policies and privacy practices of the websites you visit both before and after visiting our website through these links.
            </p>
            <p style={pStyle}>
              However, the pdpa.otp.go.th website cannot oversee or take responsibility for the use of personal data by third parties or external organizations that receive your data through this website. We recommend that you consider accepting or declining the use of third-party cookies as we have notified you above regarding your right to manually refuse these cookies.
            </p>

            <h2 style={h2Style}>Contacting the Data Protection Officer</h2>
            <p style={pStyle}>If you have suggestions or wish to inquire about the details of the collection, use, and/or disclosure of your personal data, including requesting to exercise your rights under this policy, you can contact us through the following channels:</p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Email:</strong> compliance@otp.go.th</li>
              <li style={liStyle}><strong>Phone:</strong> 0 2215 1515 ext. 4515</li>
            </ul>
            <p style={{ ...pStyle, marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
              Policy prepared by PDPA-OTP (pdpa.otp.go.th)
            </p>
          </div>
        )}

      </div>
    </div>
  );
}