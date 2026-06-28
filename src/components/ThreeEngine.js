import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';

export class HydraThreeEngine {
  container: any;
  scrollContainer: any;
  scene: any;
  isHovered: boolean;
  _cachedMaps: any;
  camera: any;
  renderer: any;
  controls: any;
  raycaster: any;
  mouse: any;
  markersToUpdate: any[];
  scrollbarMaterial: any;
  scrollbarMesh: any;
  poiGroup: any;
  animationId: number | null;

  constructor(containerId: string, scrollContainerId: string) {
    this.animationId = null;
    this.container = document.getElementById(containerId);
    this.scrollContainer = document.getElementById(scrollContainerId);
    if (!this.container || !this.scrollContainer) return;
    
    this.scene = new THREE.Scene();
    this.isHovered = false; 
    this._cachedMaps = null;
    
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const d = 60;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    this.camera.position.set(50, 60, 50); 
    this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    this.container.appendChild(this.renderer.domElement);

    this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.5; 
    this.controls.enableRotate = false;

    this.initLighting();
    this.initHolomap();
    this.initScrollbar();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.markersToUpdate = [];

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    this.scrollContainer.addEventListener('scroll', () => this.syncScrollbar(), false);

    this.animate();
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
  }

  initHolomap() {
    const planeGeo = new THREE.PlaneGeometry(500, 500);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0x12181F, depthWrite: false });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.2;
    this.scene.add(plane);

    const waterGeo = new THREE.PlaneGeometry(490, 490);
    const waterMat = new THREE.MeshBasicMaterial({ color: 0x080B0E, depthWrite: false });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.19;
    this.scene.add(water);

    const gridHelper = new THREE.GridHelper(500, 100, 0x1B3442, 0x1B3442);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    this.poiGroup = new THREE.Group();
    this.scene.add(this.poiGroup);
  }

  generateAlphaLegionMaps() {
    if (this._cachedMaps) return this._cachedMaps;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#001a1a'; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#005f73'; ctx.lineWidth = 2;
    for(let i=0; i<256; i+=16) {
      for(let j=0; j<256; j+=16) {
        ctx.beginPath(); ctx.arc(i+8, j+8, 10, 0, Math.PI); ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._cachedMaps = { albedoTex: tex, normalTex: tex, roughnessTex: tex };
    return this._cachedMaps;
  }

  initScrollbar() {
    const maps = this.generateAlphaLegionMaps();
    this.scrollbarMaterial = new THREE.MeshPhysicalMaterial({
        map: maps.albedoTex,
        normalMap: maps.normalTex,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughnessMap: maps.roughnessTex,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissive: new THREE.Color(0x001a1a),
        emissiveIntensity: 0.5
    });

    const geo = new THREE.BoxGeometry(2, 20, 2);
    this.scrollbarMesh = new THREE.Mesh(geo, this.scrollbarMaterial);
    this.scrollbarMesh.position.set(55, 0, -20); 
    this.scene.add(this.scrollbarMesh);
  }

  syncScrollbar() {
    const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
    if(maxScroll <= 0) return;
    const scrollPercent = this.scrollContainer.scrollTop / maxScroll;
    this.scrollbarMesh.position.y = 20 - (scrollPercent * 40); 
  }

  onMouseMove(event: any) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.scrollbarMesh);

    if (intersects.length > 0) {
      if (!this.isHovered) { 
        this.isHovered = true;
        this.scrollbarMaterial.emissiveIntensity = 1.5;
        this.scrollbarMaterial.emissive.setHex(0x00DAFF);
        this.scrollbarMaterial.normalScale.set(2.5, 2.5);
        this.scrollbarMesh.scale.set(1.6, 1.0, 1.6);
      }
    } else {
      if (this.isHovered) { 
        this.isHovered = false;
        this.scrollbarMaterial.emissiveIntensity = 0.5;
        this.scrollbarMaterial.emissive.setHex(0x001a1a);
        this.scrollbarMaterial.normalScale.set(1.5, 1.5);
        this.scrollbarMesh.scale.set(1.0, 1.0, 1.0);
      }
    }
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;
    const d = 60;
    this.camera.left = -d * aspect; this.camera.right = d * aspect;
    this.camera.top = d; this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  disposeHierarchy(obj: any) {
    obj.children.forEach(child => this.disposeHierarchy(child));
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(mat => mat.dispose());
      else obj.material.dispose();
    }
  }

  updateMapPoints(selectedRows: any[]) {
    this.markersToUpdate = [];
    while(this.poiGroup.children.length > 0){ 
        const obj = this.poiGroup.children[0];
        this.disposeHierarchy(obj);
        this.poiGroup.remove(obj); 
    }

    // [AL] CELOWNIK GPS: Pozycja startowa agenta
    const crossGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
    const crossMat = new THREE.MeshBasicMaterial({color: 0xA0B2B8});
    const cross = new THREE.Mesh(crossGeo, crossMat);
    this.poiGroup.add(cross);

    if(!selectedRows || selectedRows.length === 0) return;

    const points: any[] = [new THREE.Vector3(0,0,0)]; 

    selectedRows.forEach((row) => {
      const hash = Math.abs(row.name.split('').reduce((a: number, b: string)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
      const x = (hash % 80) - 40;
      const z = ((hash >> 4) % 80) - 40;
      const pos = new THREE.Vector3(x, 0, z);
      points.push(pos);

      // Bryła budynku wireframe (Ściany grafitowe półprzezroczyste #11171E)
      const bGeo = new THREE.BoxGeometry(8, 14, 8);
      const bEdges = new THREE.EdgesGeometry(bGeo);
      const bLine = new THREE.LineSegments(bEdges, new THREE.LineBasicMaterial({ color: 0xA0B2B8 }));
      const bMat = new THREE.MeshBasicMaterial({ color: 0x11171E, transparent: true, opacity: 0.4 });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(x, 7, z);
      bLine.position.set(x, 7, z);
      this.poiGroup.add(bMesh);
      this.poiGroup.add(bLine);

      // Marker POI blado-turkusowy #3D7585 (billboarding)
      const mGeo = new THREE.PlaneGeometry(5, 5);
      const mMat = new THREE.MeshBasicMaterial({ color: 0x3D7585, side: THREE.DoubleSide });
      const marker = new THREE.Mesh(mGeo, mMat);
      marker.position.set(x, 24, z);
      this.poiGroup.add(marker);
      this.markersToUpdate.push(marker); 

      // Pionowa przerywana linia pilotażowa
      const pGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 14, z), new THREE.Vector3(x, 24, z)]);
      const pLine = new THREE.Line(pGeo, new THREE.LineBasicMaterial({color: 0xA0B2B8}));
      this.poiGroup.add(pLine);
    });

    // [AL] TRASA: Kompletna przerywana ścieżka misji wielopunktowej w odcieniu indygo #4D5175
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
    const curveLine = new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: 0x4D5175 }));
    this.poiGroup.add(curveLine);
  }

  dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.disposeHierarchy(this.scene);
    if (this._cachedMaps) {
      if (this._cachedMaps.albedoTex) this._cachedMaps.albedoTex.dispose();
      this._cachedMaps = null;
    }
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    if (this.markersToUpdate.length > 0) {
      this.markersToUpdate.forEach(marker => {
        marker.quaternion.copy(this.camera.quaternion);
      });
    }
    this.renderer.render(this.scene, this.camera);
  }
}