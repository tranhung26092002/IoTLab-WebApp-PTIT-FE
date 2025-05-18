import React from "react";
import AppLayout from "../components/AppLayout";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { ContactsOutlined } from "@ant-design/icons";

const Contact: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <ContactsOutlined /> Liên Hệ
          </Typography.Title>
        </motion.div>

        <motion.div
          className="mb-24 xs:mb-14 shadow-xl rounded-lg overflow-hidden border-2"
          style={{ borderColor: '#d2e3c8' }}
          {...fadeInUp}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2924013039187!2d105.78484157491434!3d20.980912980656438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1733414001712!5m2!1svi!2s"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        <div className="container mx-auto p-5 flex gap-8 flex-wrap">
          <motion.div
            className="flex-1 bg-gradient-to-br from-white to-[#f5f8f5] p-6 rounded-lg shadow-lg min-w-[300px]"
            {...fadeInUp}
            style={{ borderColor: '#86a789', borderWidth: '1px' }}
          >
            <h2 className="text-2xl mb-4 forest--dark--color font-semibold">Liên Hệ IoT LAB</h2>
            <p className="text-base mb-6 moss--color">
              Hãy liên hệ với chúng tôi bất cứ khi nào bạn cần. Chúng tôi sẽ phản
              hồi trong thời gian sớm nhất!
            </p>
            <ul className="list-none p-0">
              {[
                { icon: "envelope", href: "mailto:tranvanhung26092002@gmail.com", text: "tranvanhung26092002@gmail.com" },
                { icon: "phone", href: "tel:+84386527618", text: "(+84) 386 527 618" },
                { icon: "location-dot", href: "#", text: "Văn Quán, Hà Đông, Hà Nội" }
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="mb-4"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-2">
                    <i className={`fa-solid fa-${item.icon} mr-3 pine--color text-xl`}></i>
                    <a
                      href={item.href}
                      className="forest--dark--color hover:text-[#4f6f52] transition-colors"
                    >
                      {item.text}
                    </a>
                  </div>
                  <hr className="border-t border-[#d2e3c8]" />
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="flex-2 bg-gradient-to-br from-white to-[#f5f8f5] p-6 rounded-lg shadow-lg flex flex-col gap-5"
            {...fadeInUp}
            style={{ borderColor: '#86a789', borderWidth: '1px' }}
          >
            <div className="flex flex-wrap gap-5">
              {['name', 'email', 'phone'].map((field) => (
                <motion.div
                  key={field}
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    placeholder={field === 'name' ? 'Tên của bạn' :
                      field === 'email' ? 'Địa chỉ email' : 'Số điện thoại'}
                    className="w-full p-4 border-2 border-[#d2e3c8] rounded-md text-base focus:border-[#4f6f52] focus:outline-none transition-colors bg-white/80"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <input
                type="text"
                name="subject"
                placeholder="Chủ đề"
                className="w-full p-4 border-2 border-[#d2e3c8] rounded-md text-base focus:border-[#4f6f52] focus:outline-none transition-colors bg-white/80"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <textarea
                name="message"
                required
                placeholder="Tin nhắn của bạn"
                className="w-full h-54 p-4 border-2 border-[#d2e3c8] rounded-md text-base focus:border-[#4f6f52] focus:outline-none transition-colors resize-none bg-white/80"
                rows={6}
              ></textarea>
            </motion.div>

            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4f6f52] to-[#3a5a40] text-white text-base rounded-md transition-all duration-300 hover:from-[#3a5a40] hover:to-[#2c4a2d] shadow-md hover:shadow-xl"
              >
                <i className="fa-solid fa-paper-plane"></i>
                <span>Gửi đi</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contact;