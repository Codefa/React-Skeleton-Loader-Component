import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Styles
import './SkeletonLoader.scss';

export const rootTypes = {
  'agenda-card': 'image, text@3',
  'showcase-card': 'image, text@2',
  'mobile-gcv-card': 'avatar, paragraph',
  'mobile-showcase-card': 'avatar, paragraph',
  'blog-image': 'image',
  actions: 'button@2',
  article: 'heading, paragraph',
  avatar: 'avatar',
  button: 'button',
  card: 'image, heading',
  'card-avatar': 'image, list-item-avatar',
  chip: 'chip',
  divider: 'divider',
  heading: 'heading',
  image: 'image',
  'list-item': 'text',
  'list-item-avatar': 'avatar, text',
  'list-item-two-line': 'sentences',
  'list-item-avatar-two-line': 'avatar, sentences',
  'list-item-three-line': 'paragraph',
  'list-item-avatar-three-line': 'avatar, paragraph',
  paragraph: 'text@3',
  sentences: 'text@2',
  subtitle: 'text',
  text: 'text',
};

function genBone(type, children) {
  return (
    <div className={`skeleton-loader__bone skeleton-loader__${type}`}>
      {children}
    </div>
  );
}

function genBones(bone) {
  const [type, length] = bone.split('@');
  return Array.from({ length }).map(() => genStructure(type));
}

function genStructure(type) {
  let children = [];

  if (!type) return children;

  const bone = rootTypes[type];

  if (type === bone) {
    // End of recursion, do nothing
  } else if (type.includes(',')) return mapBones(type);
  else if (type.includes('@')) return genBones(type);
  else if (bone.includes(',')) children = mapBones(bone);
  else if (bone.includes('@')) children = genBones(bone);
  else if (bone) children.push(genStructure(bone));

  return [genBone(type, children)];
}

function mapBones(bones) {
  return bones.replace(/\s/g, '').split(',').map(genStructure);
}

function SkeletonLoader(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const wrapInArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
    setItems(genStructure(wrapInArray(props.type).join(',')));
  }, [props.type]);

  const isLoading = !props.children || props.loading;

  return (
    <div
      className={`skeleton-loader ${
        props.boilerplate ? 'skeleton-loader--boilerplate' : ''
      }`}
      aria-busy={!props.boilerplate ? isLoading : undefined}
      aria-live={!props.boilerplate ? 'polite' : undefined}
      aria-label={!props.boilerplate ? props.loadingText : undefined}
      role={!props.boilerplate ? 'alert' : undefined}
    >
      {isLoading ? items : props.children}
    </div>
  );
}

SkeletonLoader.propTypes = {
  boilerplate: PropTypes.bool,
  color: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SkeletonLoader.defaultProps = {
  boilerplate: false,
  loading: false,
  loadingText: '',
  type: 'image',
};

export default SkeletonLoader;
