import ElementBuilder from '../element-builder';

class Footer extends ElementBuilder {
  public initialize() {
    this.render();
  }

  public render() {
    this.element.innerHTML = `
      <div class="container footer-container">
        <div class="footer__content">
          <a href="https://github.com/andre-sm" class="footer__github-link">2022 andre-sm</a>
          <a href="https://rs.school/js/"><i class="footer__rss-logo"></i></a>
        </div>
      </div>
    `;
  }
}

export default Footer;
