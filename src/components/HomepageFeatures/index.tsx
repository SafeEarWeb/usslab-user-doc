import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '简单易用',
    Svg: require('@site/static/img/undraw_smallerblack_paperwork.svg').default,
    description: (
      <>
       只需一条命令，系统会自动将任务提交到合适的计算节点，并为你分配所需的GPU资源。
      </>
    ),
  },
  {
    title: '专注科研',
    Svg: require('@site/static/img/undraw_smallerblack_desktop.svg').default,
    description: (
      <>
        集群计算帮助你专注于代码开发，无需担心资源或数据的存放位置。分布式文件系统使数据共享变得更加便捷。
      </>
    ),
  },
  {
    title: '更多功能',
    Svg: require('@site/static/img/undraw_smallerblack_programmer.svg').default,
    description: (
      <>
        目前支持微信通知任务完成，未来将迁移到钉钉，可能推出任务数据可视化、文件管理、数据集管理等功能。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
