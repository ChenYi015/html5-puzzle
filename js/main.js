/**
 * Created by ChenYi on 2018/5/17.
 */
init(50,"lufylegend",420,700,main);

// 图片、音乐资源相关
var sourceList = [
    {name:"3x3puzzleImage",path:"./images/3x3dog.jpg"},
    {name:"4x4puzzleImage",path:"./images/4x4pigeon.jpg"},
    {name:"5x5puzzleImage",path:"./images/5x5sunset.jpg"},
    {name:"bgm",path:"./bgm/Paragon.mp3"}
];

// 存储相关
var imgBmpd,srcList,blockList;

// 背景层、加载层、开始UI、游戏层、最上层
var bgLayer,loadingLayer,beginningLayer,gameLayer,overLayer;

// 开始时间、游戏时间、移动步数、游戏结束标志
var startTime,time,steps,isGameOver;

// 拼图阶数、单个拼图块边长
var n,chunk;

// 游戏时间文本、游戏步数文本
var timeText,stepsText;

// 背景音乐
var music;

// 主函数
function main(){
    // 全屏设置
    if (LGlobal.mobile) {
        LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    }
    LGlobal.screen(LGlobal.FULL_SCREEN);
    
    // 添加背景层
    bgLayer = new LSprite();
    addChild(bgLayer);
    
    // 初始化loadingLayer并绑定到bgLayer
    loadingLayer = new LoadingSample3();
    bgLayer.addChild(loadingLayer);
    
    // 使用LLoadManage加载资源
    LLoadManage.load(
        sourceList,
        function(progress){
            loadingLayer.setProgress(progress);
        },
        function(result){
            // 保存图片加载结果
            srcList = result;
            // 移除加载层
            bgLayer.removeChild(loadingLayer);
            loadingLayer = null;
            //初始化游戏
            initGame();
        }
    );
}

// 初始化游戏
function initGame(){
    // 初始化游戏层
    gameLayer = new LSprite();
    bgLayer.addChild(gameLayer);
    
    // 添加游戏开始界面
    addBeginningUI();
}

// 添加游戏开始界面
function addBeginningUI() {
    // 初始化开始层
    beginningLayer = new LSprite();
    beginningLayer.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#EDEDED");
    gameLayer.addChild(beginningLayer);
    
    // 游戏标题
    var title = new LTextField();
    title.text = "拼图游戏";
    title.size = 50;
    title.weight = "bold";
    title.x = (LGlobal.width - title.getWidth()) / 2;
    title.y = 140;
    title.color = "#FFFFFF";
    title.lineWidth = 5;
    title.lineColor = "#000000";
    title.stroke = true;
    beginningLayer.addChild(title);
    
    // 开始游戏提示
    var hint = new LTextField();
    hint.text = "- 点击屏幕开始游戏 -";
    hint.size = 25;
    hint.x = (LGlobal.width - hint.getWidth()) / 2;
    hint.y = 370;
    beginningLayer.addChild(hint);
    
    // 开始游戏
    beginningLayer.addEventListener(LMouseEvent.MOUSE_UP, function () {
        beginningLayer.removeAllChild();
        beginningLayer.removeAllEventListener();
        // 选择游戏难度
        chooseGame();
    });
}

// 选择游戏难度
function chooseGame(){
    // 游戏难度
    var levelText = new LTextField();
    levelText.text = "选择游戏难度";
    levelText.size = 50;
    levelText.weight = "bold";
    levelText.x = (LGlobal.width - levelText.getWidth()) / 2;
    levelText.y = 140;
    levelText.color = "#FFFFFF";
    levelText.lineWidth = 5;
    levelText.lineColor = "#000000";
    levelText.stroke = true;
    beginningLayer.addChild(levelText);
    // 简单模式
    var levelText1 = new LTextField();
    levelText1.text = "简单";
    levelText1.size = 50;
    levelText1.weight = "bold";
    levelText1.x = (LGlobal.width - levelText1.getWidth()) / 2;
    levelText1.y = 260;
    levelText1.color = "#FFFFFF";
    levelText1.lineWidth = 5;
    levelText1.lineColor = "#000000";
    levelText1.stroke = true;
    beginningLayer.addChild(levelText1);
    levelText1.addEventListener(LMouseEvent.MOUSE_UP,function(){
        beginningLayer.remove();
        startGame(1);
    });
    // 中等模式
    var levelText2 = new LTextField();
    levelText2.text = "中等";
    levelText2.size = 50;
    levelText2.weight = "bold";
    levelText2.x = (LGlobal.width - levelText2.getWidth()) / 2;
    levelText2.y = 360;
    levelText2.color = "#FFFFFF";
    levelText2.lineWidth = 5;
    levelText2.lineColor = "#000000";
    levelText2.stroke = true;
    beginningLayer.addChild(levelText2);
    levelText2.addEventListener(LMouseEvent.MOUSE_UP,function(){
        beginningLayer.remove();
        startGame(2);
    });
    // 困难模式
    var levelText3 = new LTextField();
    levelText3.text = "困难";
    levelText3.size = 50;
    levelText3.weight = "bold";
    levelText3.x = (LGlobal.width - levelText3.getWidth()) / 2;
    levelText3.y = 460;
    levelText3.color = "#FFFFFF";
    levelText3.lineWidth = 5;
    levelText3.lineColor = "#000000";
    levelText3.stroke = true;
    beginningLayer.addChild(levelText3);
    levelText3.addEventListener(LMouseEvent.MOUSE_UP,function(){
        beginningLayer.remove();
        startGame(3);
    });
}

// 开始游戏
function startGame(level){
    var puzzleImage;
    switch(level){
        case 1:{
            puzzleImage = "3x3puzzleImage";
            n = 3;
            chunk = 420 / n;
            break;
        }
        case 2:{
            puzzleImage = "4x4puzzleImage";
            n = 4;
            chunk = 420 / n;
            break;
        }
        case 3:{
            puzzleImage = "5x5puzzleImage";
            n = 5;
            chunk = 420 / n;
            break;
        }
    }
    imgBmpd = new LBitmapData(srcList[puzzleImage]);
    // 初始化最上层
    overLayer = new LSprite();
    bgLayer.addChild(overLayer);
    isGameOver = false;
    // 初始化时间和步数
    startTime = (new Date()).getTime();
    time = 0;
    steps = 0;
    // 初始化拼图块列表
    initBlockList();
    // 打乱拼图
    getRandomBlockList();
    // 显示拼图
    showBlock();
    // 显示缩略图
    showThumbnail();
    // 显示时间
    addTimeText();
    // 显示步数
    addStepsText();
    // 播放音乐
    playMusic();
    // 开始帧循环
    gameLayer.addEventListener(LEvent.ENTER_FRAME, onFrame);
}

// 初始化拼图块列表
function initBlockList(){
    blockList = [];
    for(var i = 0; i < n*n; i++) {
        // 根据序号计算拼图块图片显示位置
        var y = Math.floor(i/n), x = i % n;
        blockList.push(new Block(i, x, y));
    }
}

// 获得随机的拼图块列表
function getRandomBlockList () {
    // 随机打乱拼图
    var tempList;
    tempList = blockList.slice(0, n * n - 1).sort(function () {
        return 0.5 - Math.random();
    });
    var i,l = blockList.length;
    for(i = 0; i < l - 1; i++)
        blockList[i] = tempList[i];
    
    // 计算逆序和
    var reverseAmount = 0;
    for (i = 0; i < l; i++) {
        var currentBlock = blockList[i];
        for (var j = i + 1; j < l; j++) {
            var comparedBlock = blockList[j];
            
            if (comparedBlock.index < currentBlock.index) {
                reverseAmount++;
            }
        }
    }
    
    // 检测打乱后是否可还原
    if (reverseAmount % 2 !== 0) {
        // 不合格，重新打乱
        getRandomBlockList();
    }
}

// 显示拼图
function showBlock() {
    for(var i = 0; i < blockList.length; i++) {
        var block = blockList[i];
        
        // 根据序号计算拼图块位置
        var y = Math.floor(i/n), x = i % n;
        block.setLocation(x, y);
    
        if(block.index === n*n - 1)
            continue;
        gameLayer.addChild(block);
    }
}

// 显示缩略图
function showThumbnail() {
    var thumbnail = new LBitmap(imgBmpd);
    thumbnail.scaleX = 200 / imgBmpd.width;
    thumbnail.scaleY = 200 / imgBmpd.height;
    thumbnail.x = (LGlobal.width - 100) /2;
    thumbnail.y = 460;
    overLayer.addChild(thumbnail);
}

// 添加游戏时间文本
function addTimeText() {
    timeText = new LTextField();
    timeText.stroke = true;
    timeText.lineWidth = 3;
    timeText.lineColor = "#54D9EF";
    timeText.color = "#FFFFFF";
    timeText.size = 22;
    timeText.x = 20;
    timeText.y = 520;
    overLayer.addChild(timeText);
    
    updateTimeText();
}

// 更新游戏时间文本
function updateTimeText() {
    timeText.text = "时间：" + getTimeText();
}

// 获取时间文本
function getTimeText() {
    var d = new Date(time);
    
    return d.getMinutes() + " : " + d.getSeconds();
}

// 添加步数文本
function addStepsText() {
    stepsText = new LTextField();
    stepsText.stroke = true;
    stepsText.lineWidth = 3;
    stepsText.lineColor = "#54D9EF";
    stepsText.color = "#FFFFFF";
    stepsText.size = 22;
    stepsText.x = 20;
    stepsText.y = 620;
    overLayer.addChild(stepsText);
    
    updateStepsText();
}

// 更新步数文本
function updateStepsText() {
    stepsText.text = "步数：" + steps;
}

// 帧循环
function onFrame(){
    // 判断游戏是否结束
    if(isGameOver) {
        return;
    }
    
    // 获取当前时间
    var currentTime = (new Date()).getTime();
    
    // 计算使用的时间并更新时间显示
    time = currentTime - startTime;
    updateTimeText();
}

// 游戏结束
function gameOver(){
    isGameOver = true;
    // 结果层
    var resultLayer = new LSprite();
    resultLayer.filters = [new LDropShadowFilter()];
    resultLayer.graphics.drawRoundRect(3, "#BBBBBB", [0, 0, 350, 350, 5], true,"#DDDDDD");
    resultLayer.x = (LGlobal.width - resultLayer.getWidth()) / 2;
    resultLayer.y = LGlobal.height / 2;
    resultLayer.alpha = 0;
    overLayer.addChild(resultLayer);
    
    // 通关文本
    var title = new LTextField();
    title.text = "游戏通关";
    title.weight = "bold";
    title.stroke = true;
    title.lineWidth = 3;
    title.lineColor = "#555555";
    title.size = 30;
    title.color = "#FFFFFF";
    title.x = (resultLayer.getWidth() - title.getWidth()) / 2;
    title.y = 30;
    resultLayer.addChild(title);
    
    var usedTimeText = new LTextField();
    usedTimeText.text = "游戏用时：" + getTimeText(time);
    usedTimeText.size = 20;
    usedTimeText.stroke = true;
    usedTimeText.lineWidth = 2;
    usedTimeText.lineColor = "#555555";
    usedTimeText.color = "#FFFFFF";
    usedTimeText.x = (resultLayer.getWidth() - usedTimeText.getWidth()) / 2;
    usedTimeText.y = 130;
    resultLayer.addChild(usedTimeText);
    
    var usedStepsText = new LTextField();
    usedStepsText.text = "所用步数：" + steps;
    usedStepsText.size = 20;
    usedStepsText.stroke = true;
    usedStepsText.lineWidth = 2;
    usedStepsText.lineColor = "#555555";
    usedStepsText.color = "#FFFFFF";
    usedStepsText.x = usedTimeText.x;
    usedStepsText.y = 180;
    resultLayer.addChild(usedStepsText);
    
    var hintText = new LTextField();
    hintText.text = "- 点击屏幕重新开始 -";
    hintText.size = 23;
    hintText.stroke = true;
    hintText.lineWidth = 2;
    hintText.lineColor = "#888888";
    hintText.color = "#FFFFFF";
    hintText.x = (resultLayer.getWidth() - hintText.getWidth()) / 2;
    hintText.y = 260;
    resultLayer.addChild(hintText);
    
    LTweenLite.to(resultLayer, 0.5, {
        alpha : 0.7,
        y : (LGlobal.height - resultLayer.getHeight()) / 2,
        onComplete : function () {
            // 点击界面重新开始游戏
            bgLayer.addEventListener(LMouseEvent.MOUSE_UP, function () {
                bgLayer.removeAllChild();
                bgLayer.removeAllEventListener();
                initGame();
            });
        }
    });
}

// 播放音乐
function playMusic(){
    music = new LSound();
    music.load(srcList["bgm"]);
    music.play();
}