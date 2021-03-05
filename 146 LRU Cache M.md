# 146. LRU Cache M

![](https://cdn.nlark.com/yuque/0/2021/png/1064098/1610613640214-6744a76c-c3bf-45b6-a4a4-0a1d2816d2ad.png)

# Java

```java
class LRUCache {
    //建立双向链表表示缓存k/v对的使用前后关系，最近使用的k/v在链表头；
    class DNode{
        int key;
        int val;
        DNode prev;
        DNode next;
        public DNode(){}
        public DNode(int key, int val){
            this.key = key;
            this.val = val;
        }
    }
    private DNode head, tail;
    //建立哈希表用来在O(1)时间找到节点
    private Map<Integer, DNode> cache = new HashMap<>();
    
    private int size;
    private int capacity;

    public LRUCache(int capacity) {
        this.size = 0;
        this.capacity = capacity;
        head = new DNode();
        tail = new DNode();
        head.next = tail;
        tail.prev = head;
    }
    
    //返回key对应node的val；若node不存在，返回-1，若存在，在返回之前将该node移到最前端；
    public int get(int key) {
        DNode node = cache.get(key);
        if( node == null ) 
            return -1;
        moveToHead(node);
        return node.val;
    }
    //修改（加入） k/v缓存：
    //若未存在key，新建node并将其加入哈希表，将node放在表头
        //若大小溢出，则删除最尾端节点。
    //若已存在key，修改node值，将node放在表头；
    public void put(int key, int val) {
        DNode oldNode = cache.get( key );
        if( oldNode == null ){
            DNode newNode = new DNode( key, val );
            cache.put( key, newNode );
            addToHead( newNode );
            size++;
        
            if(size > capacity){
                DNode tailNode = removeTail();
                cache.remove( tailNode.key );
                size--;
            }
        }
        else{
            oldNode.val = val;
            moveToHead(oldNode);
        }
    }
    
    private DNode removeTail(){
        DNode tailNode = tail.prev;
        removeNode( tailNode );
        return tailNode;
    }
    private void removeNode( DNode node ){
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    private void addToHead( DNode node){
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node; 
    }
    private void moveToHead(DNode node){
        removeNode( node );
        addToHead( node );
    }
}
```

# JS

## 通法：用双端链表和map

```js
class DNode{
    //为了删除等操作方便，将key作为DNode的属性；
    constructor( key = null, val = null ){
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
} 

class LRUCache {
    constructor(capacity) {
        this.size = 0;
        this.capacity = capacity;
        this.dumHead = new DNode();
        this.dumTail = new DNode();
        this.dumHead.next = this.dumTail;
        this.dumTail.prev = this.dumHead; //注意这里要初始化指针
        this.cache = new Map();
    }
    //返回key对应node的val，并将其提到前端。
    get( key ){
        const thisNode = this.cache.get( key );
        if( !thisNode )
            return -1;
        this.moveToHead( thisNode );
        return thisNode.val;
    }
    //
    put( key, val ){
        const oldNode = this.cache.get( key );
        if( !oldNode ){
            const newNode = new DNode( key, val );
            this.cache.set( key, newNode );
            this.addToHead( newNode );
            this.size++;
            
            if( this.size > this.capacity ){
                const tailNode = this.removeTail();
                this.cache.delete( tailNode.key );
                this.size--;
            }

        }
        else{
            oldNode.val = val;
            this.moveToHead( oldNode );
        }
    }

    removeNode( node ){
        node.prev.next = node.next;
        node.next.prev = node.prev;
        
        
    }
    addToHead( node ){
        node.prev = this.dumHead;
        node.next = this.dumHead.next;
        this.dumHead.next.prev = node;
        this.dumHead.next = node;
    }
    moveToHead( node ){
        this.removeNode( node );
        this.addToHead( node );
    }
    removeTail( ){
        const tailNode = this.dumTail.prev;
        this.removeNode( tailNode );
        return tailNode;
    }

};
```

## 特法：利用JS的map自有顺序

由于map（和set）保存key/value的顺序是按照插入的先后顺序（**类似于队列**）来的，即**先设的key在遍历时也会先遍历到；**

因此，更新key只需要删除再设置就能表示为最近使用，就不用双向链表。

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)

      this.cache.delete(key)
      this.cache.set(key, value)

      return value
    }

    return -1
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 如果存在就更新（删除后加入）
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 如果超过缓存最大值就删除第一个
      this.cache.delete(this.cache.keys().next().value)
    }

    this.cache.set(key, value)
  }
}
```