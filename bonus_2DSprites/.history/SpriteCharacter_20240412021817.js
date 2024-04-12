import { Scene } from "three";
import * as THREE from 'three'

/**
 * This class provides to functionality to animate sprite sheets.
 */
export class SpriteFlipbook {

    tilesHoriz = 0;
    tilesVert = 0;
     currentTile = 0 ;

     map; 
     maxDisplayTime = 0;
     elapsedTime = 0;
     runningTileArrayIndex = 0;

     playSpriteIndices = []; 
     sprite;

    /**
     * 
     * @param spriteTexture A sprite sheet with sprite tiles
     * @param tilesHoriz Horizontal number of tiles
     * @param tilesVert Vertical number of tiles
     * @param scene Three.js scene which will contain the sprite
     */
    constructor(spriteTexture, tilesHoriz, tilesVert, scene) {
        this.tilesHoriz = tilesHoriz;
        this.tilesVert = tilesVert;

        this.map = new THREE.TextureLoader().load(spriteTexture);
        this.map.magFilter = THREE.NearestFilter;   // sharp pixel sprite
        this.map.repeat.set( 1/tilesHoriz, 1/tilesVert );
    
        this.update(0);
    
        const material = new THREE.SpriteMaterial({ map: this.map });
    
        this.sprite = new THREE.Sprite(material);
        
        scene.add(this.sprite);
    }

    loop(playSpriteIndices, totalDuration) {
        this.playSpriteIndices = playSpriteIndices;
        this.runningTileArrayIndex = 0;
        this.currentTile = playSpriteIndices[this.runningTileArrayIndex];
        this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
        this.elapsedTime = this.maxDisplayTime; // force to play new animation
    }

    setPosition (x, y, z) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.position.z = z;
    }

    addPosition (x, y, z) {
        this.sprite.position.x += x;
        this.sprite.position.y += y;
        this.sprite.position.z += z;
    }

    getPosition (){
        return this.sprite.position;
    }

    public update(delta: number) {
        this.elapsedTime += delta;

        if (this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime) {
            this.elapsedTime = 0;
            this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length;
            this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex];

            const offsetX  = (this.currentTile % this.tilesHoriz) / this.tilesHoriz;
            const offsetY = (this.tilesVert - Math.floor(this.currentTile / this.tilesHoriz) -1 ) / this.tilesVert;

            this.map.offset.x = offsetX;
            this.map.offset.y = offsetY;
        }
    }
}