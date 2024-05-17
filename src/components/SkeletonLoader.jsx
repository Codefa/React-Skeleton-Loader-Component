import React, { useState, useEffect } from 'react';

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

const genBone = (type, children, index) => (
  <div key={index} className={`skeleton-loader__bone skeleton-loader__${type}`}>
    {children}
  </div>
);

const genBones = (bone) => {
  const [type, length] = bone.split('@');
  return Array.from({ length: Number(length) }).map((_, index) =>
    genStructure(type, index)
  );
};

const genStructure = (type, parentIndex = '') => {
  let children = [];

  if (!type) return children;

  const bone = rootTypes[type];

  if (type === bone) {
    // End of recursion, do nothing
  } else if (type.includes(',')) return mapBones(type, parentIndex);
  else if (type.includes('@')) return genBones(type);
  else if (bone.includes(',')) children = mapBones(bone, parentIndex);
  else if (bone.includes('@')) children = genBones(bone);
  else if (bone) children.push(genStructure(bone, parentIndex));

  return [genBone(type, children, parentIndex)];
};

const mapBones = (bones, parentIndex = '') => {
  return bones
    .replace(/\s/g, '')
    .split(',')
    .map((bone, index) => genStructure(bone, `${parentIndex}-${index}`))
    .flat();
};

const SkeletonLoader = ({
  boilerplate = false,
  color,
  loading = false,
  loadingText = '',
  type = 'image',
  maxWidth,
  children,
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const wrapInArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
    setItems(genStructure(wrapInArray(type).join(',')));
  }, [type]);

  const isLoading = !children || loading;

  return (
    <div
      className={`skeleton-loader ${
        boilerplate ? 'skeleton-loader--boilerplate' : ''
      }`}
      aria-busy={!boilerplate ? isLoading : undefined}
      aria-live={!boilerplate ? 'polite' : undefined}
      aria-label={!boilerplate ? loadingText : undefined}
      role={!boilerplate ? 'alert' : undefined}
      style={{ maxWidth, color }}
    >
      {isLoading ? items : children}
    </div>
  );
};

export default SkeletonLoader;
