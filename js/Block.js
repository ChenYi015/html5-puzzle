/**
 * Created by ChenYi on 2018/6/4.
 */
// Block类
function Block (index, x, y) {
    // 继承自LSprite类
    LExtends(this, LSprite, []);
    
    // 位图对象
    var bmpd = imgBmpd.clone();
    bmpd.setProperties(x * chunk, y * chunk, chunk, chunk);
    this.bitmap = new LBitmap(bmpd);
    this.addChild(this.bitmap);
    
    // 拼图块边界
    var border = new LShape();
    border.graphics.drawRect(3, "#cccccc", [0, 0, chunk, chunk]);
    this.addChild(border);
    
    // 索引
    this.index = index;
    
    // 添加事件侦听
    this.addEventListener(LMouseEvent.MOUSE_UP, this.onClick);
}

// 设置拼图块的位置
Block.prototype.setLocation = function(x, y){
    this.locationX = x;
    this.locationY = y;
    
    this.x = x * chunk;
    this.y = y * chunk;
};

Block.prototype.onClick = function(e){
    var self = e.currentTarget;
    if (isGameOver) {
        return;
    }
    var checkList = [];
    
    // 判断左侧是否有方块
    if (self.locationX > 0) {
        checkList.push(Block.getBlock(self.locationX - 1, self.locationY));
    }
    // 判断右侧是否有方块
    if (self.locationX < n - 1) {
        checkList.push(Block.getBlock(self.locationX + 1, self.locationY));
    }
    // 判断上方是否有方块
    if (self.locationY > 0) {
        checkList.push(Block.getBlock(self.locationX, self.locationY - 1));
    }
    // 判断下方是否有方块
    if (self.locationY < n - 1) {
        checkList.push(Block.getBlock(self.locationX, self.locationY + 1));
    }
    for (var i = 0, l = checkList.length; i < l; i++) {
        var checkO = checkList[i];
        // 判断是否是空白拼图块
        if (checkO.index === n * n - 1) {
            steps++;
            updateStepsText();
            Block.exchangePosition(self, checkO);
            break;
        }
    }
};

Block.exchangePosition = function(b1, b2) {
    var b1x = b1.locationX, b1y = b1.locationY,
        b2x = b2.locationX, b2y = b2.locationY,
        b1Index = b1y * n + b1x,
        b2Index = b2y * n + b2x;
    
    // 在拼图块数组中交换两者位置
    blockList.splice(b1Index, 1, b2);
    blockList.splice(b2Index, 1, b1);
    
    // 交换两者显示位置
    b1.setLocation(b2x, b2y);
    b2.setLocation(b1x, b1y);
    
    // 判断游戏是否结束
    Block.isGameOver();
};

Block.getBlock = function(x, y){
    return blockList[x + n * y];
};

Block.isGameOver = function(){
    var reductionAmount = 0, l = blockList.length;
    
    // 计算还原度
    for (var i = 0; i < l; i++) {
        var block = blockList[i];
        
        if (block.index === i) {
            reductionAmount++;
        }
    }
    
    // 计算是否完全还原
    if (reductionAmount === l) {
        // 游戏结束
        gameOver();
    }
};