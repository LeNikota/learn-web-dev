const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">LUMIERE</div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item">Услуги</li>
          <li className="header__nav-item">Галерея</li>
          <li className="header__nav-item">Команда</li>
          <li className="header__nav-item">Отзывы</li>
          <li className="header__nav-item">Контакты</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;