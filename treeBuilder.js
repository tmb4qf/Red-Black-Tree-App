		function Node(index, value, color, parent, right, left){
			this.index = index;
			this.value = value;
			this.color = color;
			this.parentNode = parent;
			this.rightNode = right;
			this.leftNode = left;
		}
		
		function Tree(root){
			this.rootNode = root;
			this.count = 0
		}
		
		function computeTree(){
			
			var textContent = document.getElementById('userInput').value;
			var commands = textContent.split("\n");
			var nilNode = new Node(-1, null, "b", null, null, null);
			var rootNode = new Node(null, null, null, nilNode, nilNode, nilNode);
			var rbTree = new Tree(rootNode);
			var nodesCreated = 0;
			
			for(var i = 0; i < commands.length; ++i){
				var operation = commands[i].split(" ");
				
				if(operation[0].toLowerCase() == "insert"){
					var value = parseInt(operation[1]);
					var newNode = new Node(nodesCreated, value, "r", nilNode, nilNode, nilNode);
					nodesCreated++;
					insertNode(rbTree, newNode);
					rbTree.count = rbTree.count + 1;
				}
				else if(operation[0].toLowerCase() == "delete"){
					var value = parseInt(operation[1]);
					
					var zNode = rbTree.rootNode;
					var yNode = null;
					while(value != zNode.value){
						yNode = zNode;
						if(value < zNode.value)
							zNode = zNode.leftNode;
						else
							zNode = zNode.rightNode;
						
						if(zNode.index == -1)
							break;
					}
					
					if(zNode && zNode.index != -1){
						deleteNode(rbTree, zNode);
						rbTree.count = rbTree.count - 1;
					}
				}
			}
			
			$('#treeInfo').html('');
			var height = Math.floor(2 * Math.log(rbTree.count + 1));
			var width = $('#treeInfo').innerWidth();
			
			myPanel = new jsgl.Panel(document.getElementById("treeInfo"));
			printTree(rbTree.rootNode, width/2, 20, 1, height, myPanel, width);
		}
		
		function printTree(node, parentX, parentY, depth, height, myPanel, width){
			if(node.index == -1){
				return;
			}
			else if(node.parentNode.index == -1){
				var x = parentX;
				var y = parentY;
			}
			else if(node.index == node.parentNode.leftNode.index){
				var temp = Math.log(depth);
				var x = parentX - (width / 120) * Math.pow(2, height-depth);
				var y = parentY + 80;
			}
			else{
				var temp = Math.log(depth);
				var x = parentX + (width / 120) * Math.pow(2, height-depth);
				var y = parentY + 80;
			}
			circle = myPanel.createCircle();
			circle.setCenterLocationXY(x, y);
			circle.setRadius(15);
			circle.getStroke().setWeight(3);
			if(node.color == "r")
				circle.getStroke().setColor("red");
			else if(node.color == "b")
				circle.getStroke().setColor("black");
			myPanel.addElement(circle);
			
			var stringNum = node.value.toString();
			label = myPanel.createLabel();
			label.setText(stringNum);
			if(node.value < 10)
				label.setLocationXY(x-5,y-8);
			else
				label.setLocationXY(x-10,y-8);
			label.setBold(true);
			label.setFontFamily("sans-serif");
			label.setFontSize(16);
			myPanel.addElement(label);
			
			if(node.parentNode.index != -1){
				var line = myPanel.createLine();
				line.setStartPointXY(parentX, parentY + 17);
				line.setEndPointXY(x, y - 17);
				line.getStroke().setWeight(2);
				line.getStroke().setColor("black");
				myPanel.addElement(line);
			}
			
			printTree(node.leftNode, x, y, depth + 1, height, myPanel, width);
			printTree(node.rightNode, x, y, depth + 1, height, myPanel, width);
		}
		
		function deleteFixup(tree, xNode){
			while(xNode.index != tree.rootNode.index && xNode.color == "b"){
				if(xNode.index == xNode.parentNode.leftNode){
					var wNode = xNode.parentNode.rightNode;
					if(wNode.color == "r"){
						wNode.color = "b";
						xNode.parentNode.color = "r";
						leftRotate(tree, xNode.parentNode);
						wNode = xNode.parentNode.rightNode;
					}
					if(wNode.leftNode.color == "b" && wNode.rightNode.color == "b"){
						wNode.color = "r";
						xNode = xNode.parentNode;
					}
					else{
						if(wNode.rightNode.color == "b"){
							wNode.leftNode.color = "b";
							wNode.color = "r";
							rightRotate(tree, wNode);
							wNode = xNode.parentNode.rightNode;
						}
						wNode.color = xNode.parentNode.color;
						xNode.parentNode.color = "b";
						wNode.rightNode.color = "b";
						leftRotate(tree, xNode.parentNode);
						xNode = tree.rootNode;
					}
				}
				else{
					var wNode = xNode.parentNode.leftNode;
					if(wNode.color == "r"){
						wNode.color = "b";
						xNode.parentNode.color = "r";
						rightRotate(tree, xNode.parentNode);
						wNode = xNode.parentNode.leftNode;
					}
					if(wNode.rightNode.color == "b" && wNode.leftNode.color == "b"){
						wNode.color = "r";
						xNode = xNode.parentNode;
					}
					else{
						if(wNode.leftNode.color == "b"){
							wNode.rightNode.color = "b";
							wNode.color = "r";
							leftRotate(tree, wNode);
							wNode = xNode.parentNode.leftNode;
						}
						wNode.color = xNode.parentNode.color;
						xNode.parentNode.color = "b";
						wNode.leftNode.color = "b";
						rightRotate(tree, xNode.parentNode);
						xNode = tree.rootNode;
					}
				}
			}
			xNode.color = "b";
		}
		
		function deleteNode(tree, zNode){
			var yNode = zNode;
			var yOriginalColor = yNode.color;
			var xNode = null;
			if(zNode.leftNode.index == -1){
				xNode = zNode.rightNode;
				transplant(tree, zNode, zNode.rightNode);
			}
			else if(zNode.rightNode.index == -1){
				xNode == zNode.leftNode;
				transplant(tree, zNode, zNode.leftNode);
			}
			else{
				yNode = treeMin(zNode.rightNode)
				yOriginalColor = yNode.color;
				xNode = yNode.rightNode;
				if(yNode.parentNode.index == zNode.index)
					xNode.parentNode = yNode;
				else{
					transplant(tree, yNode, yNode.rightNode);
					yNode.rightNode = zNode.rightNode;
					yNode.rightNode.parentNode = yNode;
				}
				transplant(tree, zNode, yNode);
				yNode.leftNode = zNode.leftNode;
				yNode.leftNode.parentNode = yNode;
				yNode.color = zNode.color;
			}
			if(yOriginalColor == "b")
				deleteFixup(tree, xNode);
		}
		
		function treeMin(xNode){
			while(xNode.leftNode.index != -1)
				xNode = xNode.leftNode;
			return xNode;
		}
		function transplant(tree, uNode, vNode){
			if(uNode.parentNode.index == -1)
				tree.rootNode = vNode;
			else if(uNode.index == uNode.parentNode.leftNode.index)
				uNode.parentNode.leftNode = vNode;
			else
				uNode.parentNode.rightNode = vNode;
			
			vNode.parentNode = uNode.parentNode;
		}
		
		function insertNode(tree, zNode){
			var yNode = null;
			var xNode = tree.rootNode;
			while(xNode.index != -1){
				yNode = xNode;
				if(zNode.value < xNode.value)
					xNode = xNode.leftNode;
				else
					xNode = xNode.rightNode;
			}
			
			zNode.parentNode = yNode;
			if(tree.rootNode.value == null){
				tree.rootNode = zNode;
				tree.rootNode.parentNode.index = -1;
				tree.rootNode.parentNode.color = "b";
			}	
			else if(zNode.value < yNode.value)
				yNode.leftNode = zNode;
			else
				yNode.rightNode = zNode;
			
			insertFixup(tree, zNode);
			
		}
		
		function insertFixup(tree, zNode){
			while(zNode.parentNode.color == "r"){
				if(zNode.parentNode.index == zNode.parentNode.parentNode.leftNode.index){
					yNode = zNode.parentNode.parentNode.rightNode;
					if(yNode.color == "r"){
						zNode.parentNode.color = "b";
						yNode.color = "b";
						zNode.parentNode.parentNode.color = "r";
						zNode = zNode.parentNode.parentNode;
					}
					else{
						if(zNode.index == zNode.parentNode.rightNode.index){
							zNode = zNode.parentNode;
							leftRotate(tree, zNode);
						}
						zNode.parentNode.color = "b";
						zNode.parentNode.parentNode.color = "r";
						rightRotate(tree, zNode.parentNode.parentNode);
					}
				}
				else{
					yNode = zNode.parentNode.parentNode.leftNode;
					if(yNode.color == "r"){
						zNode.parentNode.color = "b";
						yNode.color = "b";
						zNode.parentNode.parentNode.color = "r";
						zNode = zNode.parentNode.parentNode;
					}
					else{
						if(zNode.index == zNode.parentNode.leftNode.index){
							zNode = zNode.parentNode;
							rightRotate(tree, zNode);
						}
						zNode.parentNode.color = "b";
						zNode.parentNode.parentNode.color = "r";
						leftRotate(tree, zNode.parentNode.parentNode);
					}
				}
			}
			tree.rootNode.color = "b";
		}
		
		function rightRotate(tree, xNode){
			var yNode = xNode.leftNode;
			xNode.leftNode = yNode.rightNode;
			
			if(yNode.rightNode.index != -1)
				yNode.rightNode.parentNode = xNode;
			
			yNode.parentNode = xNode.parentNode;
			if(xNode.parentNode.index == -1)
				tree.rootNode = yNode;
			else if(xNode.index == xNode.parentNode.rightNode.index)
				xNode.parentNode.rightNode = yNode;
			else
				xNode.parentNode.leftNode = yNode;
			
			yNode.rightNode = xNode;
			xNode.parentNode = yNode;
		}
		
		function leftRotate(tree, xNode){
			var yNode = xNode.rightNode;
			xNode.rightNode = yNode.leftNode;
			
			if(yNode.leftNode.index != -1)
				yNode.leftNode.parentNode = xNode;
			
			yNode.parentNode = xNode.parentNode;
			if(xNode.parentNode.index == -1)
				tree.rootNode = yNode;
			else if(xNode.index == xNode.parentNode.leftNode.index)
				xNode.parentNode.leftNode = yNode;
			else
				xNode.parentNode.rightNode = yNode;
			
			yNode.leftNode = xNode;
			xNode.parentNode = yNode;
		}