const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__column">
          <span className="footer__logo">LUMIERE</span>
          <p className="footer__slogan">
            Превзойдем твои ожидания создав уникальный образ
          </p>
        </div>

        <div className="footer__column">
          <h3 className="footer__heading">Контакты</h3>
          <address className="footer__address">
            <div className="footer__contact-item">
              <span className="footer__icon">📍</span>
              <span>ул. Садовая, 15, Москва</span>
            </div>
            <div className="footer__contact-item">
              <span className="footer__icon">📞</span>
              <a href="tel:+78005553535" className="footer__link">
                +7 (800) 555-35-35
              </a>
            </div>
          </address>
        </div>

        <div className="footer__column">
          <h3 className="footer__heading">Режим работы</h3>
          <ul className="footer__list">
            <li className="footer__list-item">Пн-Пт: 9:00 - 21:00</li>
            <li className="footer__list-item">Сб-Вс: 10:00 - 19:00</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026. Все права защищены.</span>
        <a href="#" className="footer__policy-link">
          Политика конфиденциальности
        </a>
      </div>
    </footer>
  );
};

export default Footer;