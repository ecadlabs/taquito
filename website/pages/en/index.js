const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('quick_start.html')}>Quick Start</Button>
            <Button href={'https://github.com/ecadlabs/tezos-ts'}>Github</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Description = () => (
      <Block background="light">
        {[
          {
            content:
              '* Easy to use and maintain, written in idiomatic Typescript style\n' +
              '* Well maintained and tested against all current, and anticipated Tezos protocols\n' +
              '* Portable, does not rely on any "stack" by default, except for the canonical Tezos RPC node\n' +
              '* Nightly and Continuous integration tests against official Tezos RPC nodes\n' +
              '* dApp development uses cases a first class concern, empowering new developers to get results quickly\n' +
              '* No dependencies on the Tezos RPC node for generating operations (Ex: not dependant on “forge” RPC method).\n' +
              '* Well documented API using [TypeDoc](https://tezos-ts.io/typedoc)\n' +
              '* Set of ready made React components for common use-cases, with a [Demo Gallery](https://tezos-ts.io/react-storybook/)\n' +
              '* Regular versioned releases, published to npmjs.org, with a published version strategy\n' +
              '* Participation in the [CII Best Practices](https://bestpractices.coreinfrastructure.org) program and all requirements entailed there in\n' +
              '* Portable - This library has minimum dependencies, making it usable in any js project on the front or back end.\n' +
              '* Compact - avoid bloat and keep compiled asset size low\n' +
              '* Portable, allowing wallet, dApp, or backend developers to start using the library quickly\n',
            image: `${baseUrl}img/goal.svg`,
            imageAlign: 'right',
            title: 'Goals',
          },
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Description />
        </div>
      </div>
    );
  }
}

module.exports = Index;
