$(document).ready(function () {
    let hierarchy = {
        id: 'root',
        text: '',
        children: []
    };

    let selectedNodeId; 

    renderTree(hierarchy, $('#tree-container'));

    $('#add-node').on('click', function () {
        const selectedNodeType = $('#node-type').val();
        const newNodeText = $('#node-value').val();

        if (newNodeText) {
            const newNode = { id: generateId(), text: newNodeText, children: [] };

            if (selectedNodeType === 'child') {
                addChildNode(hierarchy, selectedNodeId, newNode);
            } else if (selectedNodeType === 'parent') {
                addParentNode(hierarchy, selectedNodeId, newNode);
            } else {
                hierarchy.children.push(newNode);
            }

            renderTree(hierarchy, $('#tree-container'));
        }
    });

    $('#update-node').on('click', function () {
        const newName = $('#selected-node-name').val();
        updateNodeName(hierarchy, selectedNodeId, newName);
        renderTree(hierarchy, $('#tree-container'));
    });

    $('#delete-node').on('click', function () {
        deleteNode(hierarchy, selectedNodeId);
        renderTree(hierarchy, $('#tree-container'));
    });

    $('#tree-container').on('click', '.node', function () {
        const nodeId = $(this).data('id');
        selectedNodeId = nodeId; 
        renderSelectedNodeInfo(hierarchy, selectedNodeId);
    });

    function generateId() {
        return 'node-' + Math.random().toString(36).substr(2, 9);
    }

    function addChildNode(node, parentId, newNode) {
        if (node.id === parentId) {
            node.children.push(newNode);
        } else {
            for (let child of node.children) {
                addChildNode(child, parentId, newNode);
            }
        }
    }

    function addParentNode(node, nodeId, newNode) {
        if (node.id === nodeId) {
            const parentNode = { id: generateId(), text: newNode.text, children: [node] };
            node.id = generateId();
            node.text = '';
            node.children = [];
            node.children.push(parentNode);
        } else {
            for (let child of node.children) {
                addParentNode(child, nodeId, newNode);
            }
        }
    }

    function updateNodeName(node, nodeId, newName) {
        if (node.id === nodeId) {
            node.text = newName;
        } else {
            for (let child of node.children) {
                updateNodeName(child, nodeId, newName);
            }
        }
    }

    function deleteNode(node, nodeId) {
        if (node.children) {
            node.children = node.children.filter(child => child.id !== nodeId);
            for (let child of node.children) {
                deleteNode(child, nodeId);
            }
        }
    }

    function renderTree(node, container) {
        container.empty();
        renderNode(node, container);
        if (node.children.length > 0) {
            const childrenContainer = $('<div class="children-container"></div>');
            container.append(childrenContainer);
            for (let child of node.children) {
                renderTree(child, childrenContainer);
            }
        }
    }

    function renderNode(node, container) {
        const nodeElement = $('<div class="node" data-id="' + node.id + '"><span>' + node.text + '</span></div>');
        const addChildButton = $('<button class="add-child">Add Child</button>');
        const addParentButton = $('<button class="add-parent">Add Parent</button>');
        nodeElement.append(addChildButton).append(addParentButton);
        container.append(nodeElement);
    }

    function renderSelectedNodeInfo(node, nodeId) {
        if (node.id === nodeId) {
            $('#selected-node-name').val(node.text);
        } else {
            for (let child of node.children) {
                renderSelectedNodeInfo(child, nodeId);
            }
        }
    }
});
