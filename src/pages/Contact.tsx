import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact: React.FC = () => {
  return (
    <Fragment>
      <Header />

      <div className="mb-24 xs:mb-14">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3725.28029825021!2d105.78630017525153!3d20.98139838940363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zNjhhLzYgUGjhu5EgQW8gU2VuLCBN4buZIExhbywgSMOgIMSQw7RuZywgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1724994267750!5m2!1svi!2s"
          width="100%"
          height="350"
          style={{ borderWidth: "none" }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="container mx-auto p-5 flex gap-8 flex-wrap">
        <div className="flex-1 bg-gray-100 p-5 rounded-lg shadow-md min-w-[300px]">
          <h2 className="text-2xl mb-2">Liên Hệ OpenLAB</h2>
          <p className="text-base mb-5">
            Hãy liên hệ với chúng tôi bất cứ khi nào bạn cần. Chúng tôi sẽ phản
            hồi trong thời gian sớm nhất!
          </p>
          <ul className="list-none p-0">
            <li className="mb-4">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-envelope mr-2 text-gray-600"></i>
                <a
                  href="mailto:openlab.user@gmail.com"
                  className="text-gray-800 hover:underline"
                >
                  openlab.user@gmail.com
                </a>
              </div>
              <hr className="border-t border-gray-300" />
            </li>
            <li className="mb-4">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-phone mr-2 text-gray-600"></i>
                <a
                  href="tel:+84865746698"
                  className="text-gray-800 hover:underline"
                >
                  (+84) 865 746 698
                </a>
              </div>
              <hr className="border-t border-gray-300" />
            </li>
            <li>
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-location-pin mr-2 text-gray-600"></i>
                <a
                  href="https://www.google.com/maps/place/68+Ng%C3%B5+6+Ao+Sen,+P.+M%E1%BB%99+Lao,+H%C3%A0+%C4%90%C3%B4ng,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@20.9820423,105.7848074,17z/data=!3m1!4b1!4m5!3m4!1s0x3135accc2899c203:0x1ddb7fee1ea1e809!8m2!3d20.9820423!4d105.7873823?entry=ttu"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  68A/6 Ao Sen, Hà Đông, Hà Nội
                </a>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-2 bg-white p-5 rounded-lg shadow-md flex flex-col gap-5">
          <div className="flex flex-wrap gap-5">
            <div className="flex-1">
              <input
                type="text"
                name="name"
                placeholder="Tên của bạn"
                className="w-full p-4 border-2 border-gray-300 rounded-md text-base"
              />
            </div>
            <div className="flex-1">
              <input
                type="email"
                name="email"
                placeholder="Địa chỉ email"
                className="w-full p-4 border-2 border-gray-300 rounded-md text-base"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                className="w-full p-4 border-2 border-gray-300 rounded-md text-base"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              name="subject"
              placeholder="Chủ đề"
              className="w-full p-4 border-2 border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <textarea
              name="message"
              required
              placeholder="Tin nhắn của bạn"
              className="w-full h-54 p-4 border-2 border-gray-300 rounded-md text-base"
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 p-4 bg-red-600 text-white text-base rounded-md transition duration-300 hover:bg-blue-800"
            >
              <i className="fa-solid fa-paper-plane"></i>
              <span>Gửi đi</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Contact;
