import React, { useState } from 'react';
import { Tree } from 'react-d3-tree';
import "./App.css"
const MyTree = ({ treeData }) => (
  <div style={{ width: '400px', height: '400px' ,margin:'0px' , padding:'0px' }}>
    <Tree data={treeData} />
  </div>
);

const NodeCreator = ({ onCreateNode }) => {
  const [nodeType, setNodeType] = useState('single');
  const [nodeValue, setNodeValue] = useState('');

  const handleCreateNode = () => {
    onCreateNode({
      type: nodeType,
      value: nodeValue,
    });
    
    
    setNodeType('single');
    setNodeValue('');
  };

  return (
    <div>
      <h2>TREE</h2>
      <label>
        Node Type:
        <select value={nodeType} onChange={(e) => setNodeType(e.target.value)}>
          <option value="single">Single Node</option>
          <option value="parent">Parent Node</option>
          <option value="child">Child Node</option>
        </select>
      </label>
      <br />
      <label>
        Node Value:
        <input type="text" value={nodeValue} onChange={(e) => setNodeValue(e.target.value)} />
      </label>
      <br />
      <button onClick={handleCreateNode}>Create Node</button>
    </div>
  );
};

const App = () => {
  const [treeData, setTreeData] = useState({
    name: 'Root',
    children: [],
  });

  const handleCreateNode = ({ type, value }) => {
    const newNode = {
      name: value,
      attributes: {
        type,
      },
      children: [],
    };

    if (type === 'parent') {
      setTreeData((prevTreeData) => ({
        ...prevTreeData,
        children: [...prevTreeData.children, newNode],
      }));
    } else if (type === 'child') {
      const selectedNode = window.prompt('Enter the name of the parent node:');
      setTreeData((prevTreeData) => {
        const updatedTree = { ...prevTreeData };
        const parentNode = findNode(updatedTree, selectedNode);
        if (parentNode) {
          parentNode.children = [...parentNode.children, newNode];
        }
        return updatedTree;
      });
    } else {
      setTreeData((prevTreeData) => ({
        ...prevTreeData,
        children: [...prevTreeData.children, newNode],
      }));
    }
  };

  const findNode = (node, nodeName) => {
    if (node.name === nodeName) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const foundNode = findNode(child, nodeName);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };

  return (
    <div>
      
      <NodeCreator onCreateNode={handleCreateNode} />
      <MyTree treeData={treeData} />
    </div>
  );
};

export default App;












