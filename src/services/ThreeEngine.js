import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';

export class HydraThreeEngine {
  constructor(containerId, scrollContainerId) {
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

    const albCanvas = document.createElement('canvas');
    albCanvas.width = 256;
    albCanvas.height = 256;
    const albCtx = albCanvas.getContext('2d');
    albCtx.fillStyle = '#002129';
    albCtx.fillRect(0, 0, 256, 256);
    albCtx.strokeStyle = '#00daff';
    albCtx.lineWidth = 1.5;
    for (let i = 0; i < 256; i += 16) {
      for (let j = 0; j < 256; j += 16) {
        albCtx.beginPath();
        albCtx.arc(i + 8, j + 8, 6, 0, Math.PI);
        albCtx.stroke();
      }
    }

    const normCanvas = document.createElement('canvas');
    normCanvas.width = 256;
    normCanvas.height = 256;
    const normCtx = normCanvas.getContext('2d');
    normCtx.fillStyle = '#8080ff';
    normCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 16) {
      for (let j = 0; j < 256; j += 16) {
        normCtx.strokeStyle = '#a080ff';
        normCtx.lineWidth = 2;
        normCtx.beginPath();
        normCtx.arc(i + 8, j + 8, 6, 0, Math.PI);
        normCtx.stroke();
      }
    }

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = 256;
    roughCanvas.height = 256;
    const roughCtx = roughCanvas.getContext('2d');
    roughCtx.fillStyle = '#333333';
    roughCtx.fillRect(0, 0, 256, 256);
    roughCtx.strokeStyle = '#ffffff';
    roughCtx.lineWidth = 1;
    for (let i = 0; i < 256; i += 16) {
      for (let j = 0; j < 256; j += 16) {
        roughCtx.beginPath();
        roughCtx.arc(i + 8, j + 8, 6, 0, Math.PI);
        roughCtx.stroke();
      }
    }

    const albedoTex = new THREE.CanvasTexture(albCanvas);
    const normalTex = new THREE.CanvasTexture(normCanvas);
    const roughnessTex = new THREE.CanvasTexture(roughCanvas);

    this._cachedMaps = { albedoTex, normalTex, roughnessTex };
    return this._cachedMaps;
  }

  initScrollbar() {
    const maps = this.generateAlphaLegionMaps();
    this.scrollbarMaterial = new THREE.MeshPhysicalMaterial({
      map: maps.albedoTex,
      normalMap: maps.normalTex,
      normalScale: new THREE.Vector2(1.8, 1.8),
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
    if (maxScroll <= 0) return;
    const scrollPercent = this.scrollContainer.scrollTop / maxScroll;
    this.scrollbarMesh.position.y = 20 - (scrollPercent * 40);
  }

  onMouseMove(event) {
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
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  disposeHierarchy(obj) {
    obj.children.forEach(child => this.disposeHierarchy(child));
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(mat => mat.dispose());
      else obj.material.dispose();
    }
  }

  updateMapPoints(selectedRows) {
    this.markersToUpdate = [];
    while (this.poiGroup.children.length > 0) {
      const obj = this.poiGroup.children[0];
      this.disposeHierarchy(obj);
      this.poiGroup.remove(obj);
    }

    const crossGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xA0B2B8 });
    const cross = new THREE.Mesh(crossGeo, crossMat);
    this.poiGroup.add(cross);

    if (!selectedRows || selectedRows.length === 0) return;

    const points = [new THREE.Vector3(0, 0, 0)];
    selectedRows.forEach((row) => {
      const hash = Math.abs(row.name.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0));
      const x = (hash % 70) - 35;
      const z = ((hash >> 4) % 70) - 35;
      const pos = new THREE.Vector3(x, 0, z);
      points.push(pos);

      const bGeo = new THREE.BoxGeometry(6, 12, 6);
      const bEdges = new THREE.EdgesGeometry(bGeo);
      const bLine = new THREE.LineSegments(bEdges, new THREE.LineBasicMaterial({ color: 0x2E5B66 }));
      const bMat = new THREE.MeshBasicMaterial({ color: 0x11171E, transparent: true, opacity: 0.4 });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(x, 6, z);
      bLine.position.set(x, 6, z);
      this.poiGroup.add(bMesh);
      this.poiGroup.add(bLine);

      const mGeo = new THREE.PlaneGeometry(4, 4);
      const mMat = new THREE.MeshBasicMaterial({ color: 0x3D7585, side: THREE.DoubleSide });
      const marker = new THREE.Mesh(mGeo, mMat);
      marker.position.set(x, 20, z);
      this.poiGroup.add(marker);
      this.markersToUpdate.push(marker);

      const pPoints = [new THREE.Vector3(x, 12, z), new THREE.Vector3(x, 20, z)];
      const pGeo = new THREE.BufferGeometry().setFromPoints(pPoints);
      const pLine = new THREE.LineSegments(pGeo, new THREE.LineBasicMaterial({ color: 0xA0B2B8 }));
      this.poiGroup.add(pLine);
    });

    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
    const curveLine = new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: 0x4D5175 }));
    this.poiGroup.add(curveLine);
  }

  dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.disposeHierarchy(this.scene);
    if (this._cachedMaps) {
      if (this._cachedMaps.albedoTex) this._cachedMaps.albedoTex.dispose();
      if (this._cachedMaps.normalTex) this._cachedMaps.normalTex.dispose();
      if (this._cachedMaps.roughnessTex) this._cachedMaps.roughnessTex.dispose();
      this._cachedMaps = null;
    }
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    if (this.markersToUpdate.length > 0) {
      this.markersToUpdate.forEach(marker => {
        marker.quaternion.copy(this.camera.quaternion);
      });
    }
    this.renderer.render(this.scene, this.camera);
  }
}
