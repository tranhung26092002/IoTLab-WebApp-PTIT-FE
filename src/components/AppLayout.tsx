import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>
    <Sider>Sider</Sider>
    <Layout>
      <Header>Header</Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  </Layout>
);

export default AppLayout;
