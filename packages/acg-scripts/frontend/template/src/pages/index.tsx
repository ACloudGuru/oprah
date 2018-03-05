import { Card, Col, Row, Tabs } from 'antd';
import React from 'react';

import { Layout } from '../layouts/Layout';

const TabPane = Tabs.TabPane;

interface NextInitialPropsContext {
  pathname: string;
}

interface TeamsProps {
  pathname: string;
}

class Teams extends React.Component<TeamsProps, {}> {
  // getInitialProps only runs on components that are Pages!
  static async getInitialProps(
    context: NextInitialPropsContext
  ): Promise<TeamsProps> {
    // get components initial props on client & server
    const pathname = context.pathname;
    return { pathname };
  }

  public render() {
    return (
      <Layout pathname={this.props.pathname}>
        <div>
          <div style={{ marginTop: 10 }}>
            <Row gutter={8}>
              <Col span={6}>
                <Card bordered={false}>Chart 1</Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>Chart 2</Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>Chart 3</Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>Chart 4</Card>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: 10, backgroundColor: '#fff' }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Tab 1" key="1">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab="Tab 2" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Tab 3" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Teams;
