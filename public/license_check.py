import maya.cmds as cmds
import urllib.request
import json
import os
import uuid

LICENSE_FILE = os.path.join(os.path.expanduser("~"), ".anim3dpro_license")
API_URL = "https://anim3dpro.vercel.app/api/verify-license"

def get_mac():
    mac = uuid.getnode()
    return ':'.join(('%012X' % mac)[i:i+2] for i in range(0, 12, 2))

def verify_license_online(key, mac):
    try:
        data = json.dumps({"key": key, "mac": mac}).encode("utf-8")
        req = urllib.request.Request(
            API_URL,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result.get("valid", False), result.get("reason", "")
    except Exception:
        return None, "offline"

def save_license(key):
    with open(LICENSE_FILE, "w") as f:
        f.write(key)

def load_saved_license():
    if os.path.exists(LICENSE_FILE):
        with open(LICENSE_FILE, "r") as f:
            return f.read().strip()
    return None

def lock_rig():
    controls = cmds.ls(type='nurbsCurve')
    if controls:
        transforms = cmds.listRelatives(controls, parent=True) or []
        for ctrl in transforms:
            try:
                cmds.delete(ctrl)
            except:
                pass
    cmds.inViewMessage(
        amg="<span style='color:red'>⛔ Anim3D Pro — Licence invalide. Rig désactivé.</span>",
        pos="topCenter",
        fade=True
    )

def check_license():
    mac = get_mac()
    key = load_saved_license()

    if key:
        valid, reason = verify_license_online(key, mac)
        if valid:
            cmds.inViewMessage(
                amg="✅ <b>Anim3D Pro</b> — Licence active",
                pos="topCenter",
                fade=True
            )
            return True
        elif reason == "offline":
            cmds.inViewMessage(
                amg="⚠️ <b>Anim3D Pro</b> — Mode hors ligne",
                pos="topCenter",
                fade=True
            )
            return True
        elif reason == "mac_limit":
            lock_rig()
            return False

    key = cmds.promptDialog(
        title="Anim3D Pro — Activation",
        message="Entre ta clé de licence :",
        button=["Activer", "Annuler"],
        defaultButton="Activer",
        cancelButton="Annuler",
        dismissString="Annuler"
    )

    if key == "Activer":
        entered_key = cmds.promptDialog(query=True, text=True)
        valid, reason = verify_license_online(entered_key, mac)
        if valid:
            save_license(entered_key)
            cmds.inViewMessage(
                amg="✅ <b>Anim3D Pro</b> — Activé avec succès !",
                pos="topCenter",
                fade=True
            )
            return True
        elif reason == "mac_limit":
            cmds.warning("Anim3D Pro : Limite de 2 machines atteinte.")
            lock_rig()
            return False
        else:
            cmds.warning("Anim3D Pro : Clé invalide ou expirée.")
            lock_rig()
            return False
    else:
        lock_rig()
        return False

check_license()