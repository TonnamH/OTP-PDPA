// src/pages/CookiePolicy.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CookiePolicy() {
  const { t, i18n } = useTranslation();

  // Reusing your clean legal document styles!
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
            {t('cookiePolicyPage.title')}
          </h1>
          <p style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
            {t('cookiePolicyPage.lastUpdated')}
          </p>
        </div>

        {/* THAI VERSION */}
        {i18n.language === 'th' && (
          <div>
            <p style={pStyle}>
              เว็บไซต์ pdpa.otp.go.th มีการใช้งานเทคโนโลยีคุกกี้ หรือ เทคโนโลยีอื่นที่มีลักษณะใกล้เคียงกันกับคุกกี้ บนเว็บไซต์ของเรา เพื่อให้ผู้เยี่ยมชมเว็บไซต์ ได้รับประสบการณ์ที่ดีในการเยี่ยมชมเว็บไซต์ และ ช่วยให้เราพัฒนาระบบเว็บไซต์ ที่สามารถตอบสนองความต้องการของผู้เยี่ยมชมได้อย่างดียิ่งขึ้น
            </p>

            <h2 style={h2Style}>คำจำกัดความ</h2>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>ผู้เยี่ยมชมเว็บไซต์:</strong> คือ ผู้ที่เปิดหน้าเว็บไซต์ หรือ อ่านข้อมูลบนหน้าเว็บไซต์ ไม่ว่าจะเป็นหน้าใดก็ตาม</li>
              <li style={liStyle}><strong>ระบบเว็บไซต์:</strong> คือ ระบบการทำงานของเว็บไซต์ pdpa.otp.go.th</li>
            </ul>

            <h2 style={h2Style}>คุกกี้ คือ อะไร</h2>
            <p style={pStyle}>
              คุกกี้ คือ ไฟล์ข้อความขนาดเล็กที่จัดเก็บอยู่บนเครื่องคอมพิวเตอร์ของผู้เยี่ยมชมเว็บไซต์ เมื่อมีการเข้าสู่เว็บไซต์ และ ในแต่ละครั้งที่ผู้เยี่ยมชมเว็บไซต์เข้าสู่หน้าใดของเว็บไซต์ก็ตาม ข้อมูลในคุกกี้ จะถูกส่งกลับไปยังระบบเว็บไซต์เพื่อประมวลผล หรือ ถูกส่งต่อไปยังเว็บไซต์อื่นๆ ที่รองรับการทำงานของคุกกี้นั้นได้
            </p>
            <p style={pStyle}>
              คุกกี้มีประโยชน์ในการช่วยให้ระบบเว็บไซต์ สามารถจดจำอุปกรณ์ของผู้เยี่ยมชมเว็บไซต์ เพื่อให้บริการที่เหมาะสมกับผู้เยี่ยมชมเว็บไซต์ มากยิ่งขึ้น คุกกี้ สามารถทำงานได้หลากหลายแบบ เช่น ช่วยให้ผู้เยี่ยมชมเว็บไซต์ได้รับประสบการณ์ที่เหมาะสมในการเยี่ยมชมเว็บไซต์ สำหรับแต่ละอุปกรณ์ จดจำสิ่งที่ผู้เยี่ยมชมเว็บไซต์ชื่นชอบ และพัฒนาประสบการณ์การใช้งานของผู้เยี่ยมชมเว็บไซต์
            </p>

            <h2 style={h2Style}>ประเภทของคุกกี้ที่เราใช้งาน</h2>
            <p style={pStyle}>คุกกี้ที่ pdpa.otp.go.th ใช้สามารถแบ่งเป็นประเภทต่างๆ ได้ดังนี้:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>
                <strong>คุกกี้ที่จำเป็นต่อการใช้งานเว็บไซต์ (Strictly Necessary Cookies):</strong> คุกกี้ประเภทนี้ มีความสำคัญ ในการทำให้ผู้เยี่ยมชมเว็บไซต์ สามารถใช้งานเว็บไซต์ และ ฟังก์ชั่นต่างๆ บนเว็บไซต์ของเราได้ รวมถึงช่วยให้ผู้เยี่ยมชมเว็บไซต์ สามารถเข้าถึงข้อมูล และ ใช้เว็บไซต์ ได้อย่างปลอดภัย หากไม่มีคุกกี้ประเภทนี้ เว็บไซต์ pdpa.otp.go.th จะไม่สามารถทำงานได้อย่างปกติ รวมทั้งผู้เยี่ยมชมเว็บไซต์ จะไม่สามารถใช้บริการบางอย่างบนเว็บไซต์ได้
              </li>
              <li style={liStyle}>
                <strong>คุกกี้ที่ใช้เก็บข้อมูลการใช้งาน (Functional Cookies):</strong> คุกกี้ประเภทนี้ เป็นส่วนหนึ่งของคุกกี้ที่จำเป็นต่อการใช้งานเว็บไซต์ ใช้เพื่อการจดจำผู้เยี่ยมชมเว็บไซต์ และ การตั้งค่าต่างๆ บนเว็บไซต์ ตามลักษณะการใช้งานของผู้เยี่ยมชมเว็บไซต์ คุกกี้ชนิดนี้ใช้เพื่ออำนวยความสะดวก เมื่อผู้เยี่ยมชมเว็บไซต์ กลับมาใช้งานเว็บไซต์ ในครั้งถัดไป เช่น การจดจำชื่อผู้ใช้งาน และ ปรับแต่งการตั้งค่าให้เป็นไปตามการใช้งาน
              </li>
            </ul>

            <h2 style={h2Style}>การตั้งค่าและการปฏิเสธคุกกี้</h2>
            <p style={pStyle}>
              ผู้เยี่ยมชมเว็บไซต์ สามารถเลือกทำการปฎิเสธการทำงานของคุ้กกี้ ได้ตามความต้องการ โดยสามารถตั้งค่าเว็บบราวเซอร์ หรือ ค่าความเป็นส่วนตัวของผู้เยี่ยมชมเว็บไซต์ ด้วยการปฏิเสธการทำงานของคุ้กกี้ทั้งหมด แต่ทั้งนี้ผู้เยี่ยมชมเว็บไซต์ จะไม่สามารถใช้งานบางฟังก์ชั่นบนเว็บไซต์ได้ และ อาจจะทำให้การใช้งานเว็บไซต์ไม่มีประสิทธิภาพเท่าที่ควร
            </p>
            <p style={pStyle}>
              นอกจากการตั้งค่าความเป็นส่วนตัวบนอุปกรณ์ หรือ เว็บบราวเซอร์โดยตรงแล้ว ผู้เยี่ยมชมเว็บไซต์ ยังสามารถปฏิเสธคุกกี้ผ่านทางหน้าต่างแจ้งเตือนบนหน้าเว็บไซต์ได้อีกด้วย แต่ถ้าหากผู้เยี่ยมชมเว็บไซต์ปฏิเสธการใช้งานคุกกี้ทั้งหมด ประสบการณ์การใช้งานเว็บไซต์อาจจะไม่มีประสิทธิภาพเท่าที่ควร
            </p>

            <h2 style={h2Style}>ข้อตกลงการใช้บริการเว็บไซต์</h2>
            <p style={pStyle}>
              ในการใช้บริการเว็บไซต์ pdpa.otp.go.th ผู้เยี่ยมชมเว็บไซต์ รับทราบว่าเว็บไซต์ จะมีการใช้งานคุกกี้ประเภทต่างๆ เพื่อวัตถุประสงค์ตามที่ระบุไว้ข้างต้น และระบบเว็บไซต์ อาจเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของผู้เยี่ยมชมเว็บไซต์ ซึ่งเป็นส่วนหนึ่งของคุกกี้ดังกล่าว เพื่อวัตถุประสงค์ตามที่ระบุไว้ในประกาศนโยบายความเป็นส่วนตัวของเว็บไซต์
            </p>
            <p style={pStyle}>
              หากเว็บไซต์ pdpa.otp.go.th มีการเชื่อมโยงไปยังเว็บไซต์ของบุคคลที่สาม โปรดทราบว่าบุคคลดังกล่าวอาจมีนโยบายการใช้คุกกี้ของตนเอง เราขอแนะนำให้ผู้เยี่ยมชมเว็บไซต์ทุกท่าน อ่านนโยบายการใช้คุกกี้ของบุคคลดังกล่าวก่อนการใช้งานเว็บไซต์เหล่านั้น
            </p>

            <h2 style={h2Style}>การติดต่อเจ้าหน้าที่</h2>
            <p style={pStyle}>หากท่านมีข้อเสนอแนะ หรือต้องการสอบถามข้อมูลเกี่ยวกับรายละเอียดการเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลส่วนบุคคลของท่าน รวมถึงการขอใช้สิทธิตามนโยบายฉบับนี้ ท่านสามารถติดต่อ ผ่านช่องทางต่อไปนี้:</p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>อีเมล:</strong> compliance@otp.go.th</li>
              <li style={liStyle}><strong>เบอร์โทรศัพท์:</strong> 02 215 1515</li>
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
              The pdpa.otp.go.th website uses cookie technology or similar technologies on our website to provide visitors with a good browsing experience and to help us improve our website systems to better meet the needs of our visitors.
            </p>

            <h2 style={h2Style}>Definitions</h2>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Website Visitor:</strong> Anyone who opens or reads information on any page of the website.</li>
              <li style={liStyle}><strong>Website System:</strong> The operational system of the pdpa.otp.go.th website.</li>
            </ul>

            <h2 style={h2Style}>What are Cookies?</h2>
            <p style={pStyle}>
              Cookies are small text files stored on a visitor's computer when they enter a website. Each time a visitor accesses any page of the website, the data in the cookie is sent back to the website system for processing or forwarded to other websites that support that specific cookie.
            </p>
            <p style={pStyle}>
              Cookies are useful in helping the website system remember the visitor's device in order to provide a more tailored service. Cookies can function in various ways, such as helping visitors get the optimal browsing experience for their specific device, remembering visitor preferences, and improving overall user experience.
            </p>

            <h2 style={h2Style}>Types of Cookies We Use</h2>
            <p style={pStyle}>The cookies used by pdpa.otp.go.th can be categorized as follows:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>
                <strong>Strictly Necessary Cookies:</strong> These cookies are essential for enabling visitors to use our website and its functions securely. Without these cookies, the pdpa.otp.go.th website will not function normally, and visitors will not be able to use certain services on the site.
              </li>
              <li style={liStyle}>
                <strong>Functional Cookies:</strong> These act as an extension of necessary cookies, used to remember website visitors and their settings based on their usage behavior. This type of cookie is used to facilitate visitors when they return to the website, such as remembering usernames and adjusting settings to match their preferences.
              </li>
            </ul>

            <h2 style={h2Style}>Cookie Settings and Rejection</h2>
            <p style={pStyle}>
              Visitors can choose to reject the use of cookies according to their preferences. You can adjust your web browser settings or privacy settings to reject all cookies. However, please note that doing so may prevent you from using certain functions on the website and may result in a less efficient browsing experience.
            </p>
            <p style={pStyle}>
              In addition to configuring privacy settings directly on your device or web browser, visitors can also reject cookies via the cookie consent banner on the website. Again, if a visitor rejects all cookies, the overall website experience may not be fully optimized.
            </p>

            <h2 style={h2Style}>Website Terms of Service</h2>
            <p style={pStyle}>
              By using the pdpa.otp.go.th website, visitors acknowledge that the website uses various types of cookies for the purposes stated above. The website system may collect, use, or disclose visitors' personal data as part of these cookies for the purposes specified in the website's Privacy Policy.
            </p>
            <p style={pStyle}>
              If the pdpa.otp.go.th website contains links to third-party websites, please note that those third parties may have their own cookie policies. We recommend that all visitors read the cookie policies of such third parties before using their websites.
            </p>

            <h2 style={h2Style}>Contacting the Data Protection Officer</h2>
            <p style={pStyle}>If you have suggestions or wish to inquire about the details of the collection, use, and/or disclosure of your personal data, including requesting to exercise your rights under this policy, you can contact us through the following channels:</p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Email:</strong> compliance@otp.go.th</li>
              <li style={liStyle}><strong>Phone:</strong> 02 215 1515</li>
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